import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { config } from '../config/env';
import { logger } from '../utils/logger';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message }: ContactFormData = req.body;

    // Validación básica
    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        error: 'Todos los campos son obligatorios'
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
      return;
    }

    // Configurar transporter de Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // HTML del email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00C853 0%, #00A843 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #00C853; margin-bottom: 5px; }
            .value { background: white; padding: 12px; border-left: 3px solid #00C853; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📧 Nuevo Mensaje de Contacto</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">PQ Traders - Formulario Web</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Nombre:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">📋 Asunto:</div>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="label">💬 Mensaje:</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
              
              <div class="footer">
                <p>Este mensaje fue enviado desde el formulario de contacto de <strong>pqtraders.com</strong></p>
                <p>Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Configurar opciones del email
    const mailOptions = {
      from: `"PQ Traders Contacto" <${process.env.SMTP_USER}>`,
      to: 'info@pqtraders.com',
      replyTo: email,
      subject: `[Contacto Web] ${subject}`,
      html: htmlContent,
      text: `
Nuevo mensaje de contacto - PQ Traders

Nombre: ${name}
Email: ${email}
Asunto: ${subject}

Mensaje:
${message}

---
Enviado desde pqtraders.com
${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}
      `.trim(),
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    logger.info(`Email de contacto enviado desde: ${email}`);

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente. Te responderemos pronto.'
    });

  } catch (error: any) {
    logger.error('Error al enviar email de contacto:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al enviar el mensaje. Por favor, intenta de nuevo o contáctanos directamente a info@pqtraders.com'
    });
  }
};
