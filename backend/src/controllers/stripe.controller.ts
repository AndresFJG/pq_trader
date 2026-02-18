import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Stripe from 'stripe';
import { supabase } from '../config/supabase';
import { NotificationService } from '../services/notification.service';
import { config } from '../config/env';
import { logger } from '../utils/logger';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-02-24.acacia' as any,
});

/**
 * @desc    Crear Checkout Session de Stripe
 * @route   POST /api/stripe/checkout
 * @access  Private
 */
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productType, productId, productName, amount, currency = 'usd' } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    // Obtener email del usuario
    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (!user) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }

    let finalAmount = amount;
    let finalProductName = productName;

    // Si se envía productId, SIEMPRE buscar en la base de datos para obtener el nombre correcto
    if (productId) {
      const { data: product } = await supabase
        .from('courses')
        .select('price, title')
        .eq('id', productId)
        .single();

      if (product) {
        // Si no hay amount, usar el precio de la BD
        if (!amount) {
          finalAmount = product.price;
        }
        // SIEMPRE usar el título de la BD (ignora lo que envíe el frontend)
        finalProductName = product.title;
      }
    }

    // Si no hay productName y no hay productId, usar default
    if (!finalProductName) {
      finalProductName = 'Producto';
    }

    if (!finalAmount || finalAmount <= 0) {
      res.status(400).json({ success: false, error: 'Monto de pago inválido' });
      return;
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: finalProductName || 'Producto PQ Trader',
              description: `${productType}: ${finalProductName}`,
            },
            unit_amount: Math.round(finalAmount * 100), // Convertir a centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        userId: String(userId),
        productType,
        productId: String(productId),
        productName: finalProductName,
      },
    });

    logger.info('Stripe session created', {
      sessionId: session.id,
      userId,
      productId,
      productType,
      productName: finalProductName,
    });

    // 💾 Guardar transacción inmediatamente (no esperar webhook)
    const transactionData: any = {
      user_id: userId,
      amount: finalAmount,
      currency: currency.toUpperCase(),
      type: 'stripe',
      status: 'pending', // Inicialmente pending, el webhook la marcará como completed
      payment_intent_id: session.id, // Usamos session.id como referencia
      product_id: productId,
      product_name: finalProductName || 'Producto sin nombre',
      product_type: productType || 'curso',
      metadata: {
        product_type: productType,
        product_id: productId,
        product_name: finalProductName,
        productName: finalProductName,
        productId: productId,
        session_id: session.id,
        customer_email: user.email,
      },
    };

    const { error: transactionError } = await supabase.from('transactions').insert(transactionData);

    if (transactionError) {
      logger.error('Error saving pending transaction', { error: transactionError });
    } else {
      logger.info('Pending transaction saved successfully');
    }

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error: any) {
    logger.error('Error creating Stripe checkout', { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Crear Payment Intent (para pagos directos)
 * @route   POST /api/stripe/payment-intent
 * @access  Private
 */
export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'usd', productType, productId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        userId,
        productType,
        productId,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Webhook de Stripe
 * @route   POST /api/stripe/webhook
 * @access  Public (validado por Stripe signature)
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = config.stripe.webhookSecret;

  if (!webhookSecret) {
    logger.error('STRIPE_WEBHOOK_SECRET not configured');
    res.status(500).json({ error: 'Webhook secret not configured' });
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Convertir userId y productId a números
        const userId = session.metadata?.userId ? parseInt(session.metadata.userId) : null;
        const productId = session.metadata?.productId ? parseInt(session.metadata.productId) : null;
        const productType = session.metadata?.productType;
        const productName = session.metadata?.productName;
        
        console.log('💰 Checkout completado:', {
          sessionId: session.id,
          userId,
          productType,
          productId,
          productName,
        });
        
        if (!userId) {
          console.error('❌ No se encontró userId en metadata');
          break;
        }
        
        // Buscar transacción existente (creada durante checkout)
        const { data: existingTransaction } = await supabase
          .from('transactions')
          .select('id')
          .eq('payment_intent_id', session.id)
          .eq('user_id', userId)
          .single();

        if (existingTransaction) {
          // Actualizar transacción existente a completed
          const { error: updateError } = await supabase
            .from('transactions')
            .update({
              status: 'completed',
              paid_at: new Date().toISOString(),
              payment_intent_id: session.payment_intent as string, // Actualizar con payment_intent real
            })
            .eq('id', existingTransaction.id);

          if (updateError) {
            console.error('❌ Error updating transaction:', updateError);
          } else {
            console.log('✅ Transaction updated to completed');
            
            // Crear notificación de pago procesado (para administradores)
            // NOTA: No pasar related_id porque transaction.id es INTEGER, no UUID
            await NotificationService.create({
              type: 'payment_processed',
              title: 'Pago procesado correctamente',
              message: `Pago de $${(session.amount_total || 0) / 100} ${session.currency?.toUpperCase()} - ${productName || 'Producto'}`,
              metadata: {
                transaction_id: existingTransaction.id,
                amount: (session.amount_total || 0) / 100,
                currency: session.currency?.toUpperCase() || 'USD',
                product_type: productType,
                product_name: productName,
                customer_email: session.customer_email,
                customer_user_id: userId,
              },
            });
          }
        } else {
          // Si no existe, crear nueva (fallback por si el checkout falló)
          console.log('⚠️ No se encontró transacción pendiente, creando nueva...');
          
          const transactionData: any = {
            user_id: userId,
            amount: (session.amount_total || 0) / 100,
            currency: session.currency?.toUpperCase() || 'USD',
            type: 'stripe',
            status: 'completed',
            payment_intent_id: session.payment_intent as string,
            metadata: {
              product_type: productType,
              product_id: productId,
              product_name: productName,
              productName: productName,
              productId: productId,
              session_id: session.id,
              customer_email: session.customer_email,
            },
            paid_at: new Date().toISOString(),
          };

          // Agregar columnas nuevas si existen
          try {
            transactionData.product_id = productId;
            transactionData.product_name = productName || 'Producto sin nombre';
            transactionData.product_type = productType || 'unknown';
          } catch (e) {
            console.log('⚠️ Usando metadata para información de producto');
          }

          const { error: transactionError } = await supabase.from('transactions').insert(transactionData);

          if (transactionError) {
            console.error('❌ Error saving transaction:', transactionError);
          } else {
            console.log('✅ Transaction saved successfully');
          }
        }

        // Si es un curso, crear el enrollment (aceptar tanto 'curso' como 'course')
        if ((productType === 'curso' || productType === 'course') && productId) {
          console.log('📚 Creando enrollment...', { userId, productId });
          
          const { data: existingEnrollment } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', productId)
            .single();

          if (existingEnrollment) {
            console.log('⚠️ Enrollment ya existe, saltando creación');
          } else {
            const { error: enrollmentError, data: enrollment } = await supabase.from('enrollments').insert({
              user_id: userId,
              course_id: productId,
              status: 'active',
              progress: 0,
              enrolled_at: new Date().toISOString(),
            }).select();

            if (enrollmentError) {
              console.error('❌ Error creating enrollment:', enrollmentError);
            } else {
              console.log('✅ Enrollment created successfully:', enrollment);
              
              // Crear notificación de nueva inscripción
              const { data: courseData } = await supabase
                .from('courses')
                .select('title')
                .eq('id', productId)
                .single();
              
              // Crear notificación de nueva inscripción (para administradores)
              // NOTA: No pasar related_id porque course.id es INTEGER, no UUID
              await NotificationService.create({
                type: 'new_enrollment',
                title: 'Nueva inscripción a curso',
                message: `Un usuario se ha inscrito al curso: ${courseData?.title || productName || 'Curso'}`,
                metadata: {
                  course_id: productId,
                  course_name: courseData?.title || productName,
                  enrollment_id: enrollment?.[0]?.id,
                  student_user_id: userId,
                },
              });
              
              // Actualizar el contador de enrolled_count del curso
              const { error: rpcError } = await supabase.rpc('increment_course_enrollment', {
                course_id: productId,
              });
              
              if (rpcError) {
                console.error('❌ Error incrementing course count:', rpcError);
              } else {
                console.log('✅ Course enrollment count incremented');
              }
            }
          }
        }

        // Si es una mentoría, crear el registro
        if (productType === 'mentoria' && productId) {
          // Obtener mentor_id de la metadata o usar mentor principal (id=1)
          const mentorIdFromMeta = session.metadata?.mentorId ? parseInt(session.metadata.mentorId) : null;
          const finalMentorId = mentorIdFromMeta || 1; // Por defecto: mentor principal (admin)
          
          const { error: mentorshipError } = await supabase.from('mentorships').insert({
            mentor_id: finalMentorId,
            student_id: userId,
            title: productName || 'Mentoría',
            description: 'Mentoría adquirida',
            type: 'individual',
            status: 'scheduled',
            price: (session.amount_total || 0) / 100,
          });

          if (mentorshipError) {
            console.error('❌ Error creating mentorship:', mentorshipError);
          } else {
            console.log('✅ Mentorship created successfully with mentor_id:', finalMentorId);
          }
        }
        
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed:', paymentIntent.id);
        
        // Registrar transacción fallida
        const failedData: any = {
          user_id: paymentIntent.metadata?.userId ? parseInt(paymentIntent.metadata.userId) : null,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency?.toUpperCase() || 'USD',
          type: 'stripe',
          status: 'failed',
          payment_intent_id: paymentIntent.id,
          metadata: paymentIntent.metadata || {},
        };

        await supabase.from('transactions').insert(failedData);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Verificar sesión y crear enrollment manualmente
 * @route   POST /api/stripe/verify-session
 * @access  Private
 */
export const verifySessionAndCreateEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    if (!sessionId) {
      res.status(400).json({ success: false, error: 'Session ID requerido' });
      return;
    }

    console.log('🔍 Verificando sesión:', { sessionId, userId });

    // Obtener sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      res.status(404).json({ success: false, error: 'Sesión no encontrada' });
      return;
    }

    if (session.payment_status !== 'paid') {
      res.status(400).json({ success: false, error: 'Pago no completado' });
      return;
    }

    // Convertir IDs a números
    const sessionUserId = session.metadata?.userId ? parseInt(session.metadata.userId) : null;
    const productId = session.metadata?.productId ? parseInt(session.metadata.productId) : null;
    const productType = session.metadata?.productType;

    console.log('📦 Metadata de sesión:', { sessionUserId, productId, productType });

    // Verificar que el usuario coincida
    if (sessionUserId !== userId) {
      res.status(403).json({ success: false, error: 'Esta sesión no pertenece a este usuario' });
      return;
    }

    // Si es un curso, crear enrollment (aceptar tanto 'curso' como 'course')
    if ((productType === 'curso' || productType === 'course') && productId) {
      // Verificar si ya existe el enrollment
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', productId)
        .single();

      if (existingEnrollment) {
        console.log('✅ Enrollment ya existe');
        res.json({ 
          success: true, 
          message: 'Ya estás inscrito en este curso',
          enrollment: existingEnrollment 
        });
        return;
      }

      // Crear enrollment
      console.log('📚 Creando enrollment...', { userId, productId });
      
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: productId,
          status: 'active',
          progress: 0,
          enrolled_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (enrollmentError) {
        console.error('❌ Error creando enrollment:', enrollmentError);
        
        // Si el error es por duplicado, considerarlo exitoso
        if (enrollmentError.code === '23505') {
          console.log('⚠️ Enrollment ya existe (duplicado), considerando exitoso');
          res.json({ 
            success: true, 
            message: 'Ya estás inscrito en este curso',
            alreadyEnrolled: true 
          });
          return;
        }
        
        res.status(500).json({ 
          success: false, 
          error: 'Error al crear enrollment',
          details: enrollmentError 
        });
        return;
      }

      console.log('✅ Enrollment creado:', enrollment);

      // Incrementar contador del curso
      await supabase.rpc('increment_course_enrollment', {
        course_id: productId,
      });

      res.json({ 
        success: true, 
        message: 'Enrollment creado exitosamente',
        enrollment 
      });
      return;
    }

    res.json({ 
      success: true, 
      message: 'Sesión verificada',
      session: {
        id: session.id,
        status: session.payment_status,
        amount: session.amount_total,
      }
    });
  } catch (error: any) {
    console.error('❌ Error verificando sesión:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Obtener detalles de una sesión de checkout
 * @route   GET /api/stripe/session/:sessionId
 * @access  Private
 */
export const getSessionDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Si el pago fue exitoso, actualizar transacción automáticamente
    if (session.payment_status === 'paid' && userId) {
      const { data: existingTransaction } = await supabase
        .from('transactions')
        .select('id, status')
        .eq('payment_intent_id', sessionId)
        .eq('user_id', userId)
        .single();

      if (existingTransaction && existingTransaction.status === 'pending') {
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            status: 'completed',
            paid_at: new Date().toISOString(),
            payment_intent_id: session.payment_intent as string || sessionId,
          })
          .eq('id', existingTransaction.id);

        if (!updateError) {
          console.log('✅ Transaction auto-updated to completed');
        }
      }
    }

    res.json({
      success: true,
      data: {
        id: session.id,
        status: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_email,
      },
    });
  } catch (error: any) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
