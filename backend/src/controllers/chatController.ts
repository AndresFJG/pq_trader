import { Request, Response } from 'express';
import OpenAI from 'openai';

// Inicializar OpenAI (requiere OPENAI_API_KEY en .env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Knowledge base para respuestas del chatbot
const knowledgeBase = {
  cursos: {
    python: {
      name: 'Trading Algorítmico con Python',
      price: 299,
      description: 'Aprende a crear robots de trading desde cero usando Python',
      duration: '40 horas',
    },
    strategyquant: {
      name: 'StrategyQuant Masterclass',
      price: 249,
      description: 'Domina StrategyQuant X sin necesidad de programar',
      duration: '30 horas',
    },
    risk: {
      name: 'Gestión de Riesgo Avanzada',
      price: 199,
      description: 'Protege tu capital con técnicas profesionales de gestión de riesgo',
      duration: '20 horas',
    },
  },
  mentorias: {
    individual: 150,
    pack4: 500,
    club: 150,
  },
};

// @desc    Chat with AI assistant
// @route   POST /api/chat/message
// @access  Public
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to rule-based responses
      const response = getRuleBasedResponse(message);
      return res.status(200).json({
        success: true,
        data: {
          message: response,
          source: 'rule-based',
        },
      });
    }

    // Use OpenAI for intelligent responses
    const systemPrompt = `Eres un asistente virtual de PQ Trader, una plataforma educativa de trading algorítmico.

INFORMACIÓN DE PRODUCTOS:
- Curso Python Trading: $299 (40h)
- Curso StrategyQuant: $249 (30h)
- Curso Gestión de Riesgo: $199 (20h)
- Mentoría Individual: $150/sesión
- Pack 4 Mentorías: $500
- Club StrategyQuant: $150/mes (4 webinars + plantillas + soporte)

ESTILO DE RESPUESTA:
- Amigable y profesional
- Conciso pero informativo
- Sugiere productos relevantes
- Ofrece contactar por WhatsApp para más info
- Máximo 3-4 párrafos

NUNCA:
- Inventes precios o características
- Prometas garantías de ganancias
- Des asesoramiento financiero personal`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        source: 'openai',
        usage: completion.usage,
      },
    });
  } catch (error: any) {
    console.error('[ChatAI] Error:', error);

    // Fallback to rule-based on error
    const response = getRuleBasedResponse(req.body.message);
    
    return res.status(200).json({
      success: true,
      data: {
        message: response,
        source: 'fallback',
      },
    });
  }
};

// Rule-based fallback responses
function getRuleBasedResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('curso') || msg.includes('cursos')) {
    return 'Ofrecemos varios cursos de trading algorítmico:\n\n• Trading Algorítmico con Python - $299\n• StrategyQuant Masterclass - $249\n• Gestión de Riesgo Avanzada - $199\n\nTodos incluyen acceso de por vida, certificado y soporte. ¿Te gustaría ver el catálogo completo?';
  }

  if (msg.includes('mentoría') || msg.includes('mentorías')) {
    return 'Nuestras mentorías son sesiones 1-a-1 personalizadas con traders profesionales. Tenemos dos modalidades:\n\n• Sesión Individual (90 min) - $150\n• Pack 4 Sesiones - $500 (ahorra $100)\n\n¿Quieres que te envíe más información por WhatsApp?';
  }

  if (msg.includes('strategyquant')) {
    return 'StrategyQuant X es un software profesional para crear robots de trading sin programar. Nuestro Club StrategyQuant ($150/mes) incluye:\n\n• 4 webinars mensuales en vivo\n• Plantillas exclusivas\n• Soporte prioritario\n• Descuentos en licencias\n\n¿Te interesa unirte al Club?';
  }

  if (msg.includes('precio') || msg.includes('costo') || msg.includes('plan')) {
    return 'Nuestros precios:\n\n📚 Cursos: desde $199\n👨‍🏫 Mentorías: desde $150/sesión\n🎯 Club StrategyQuant: $150/mes\n💼 Alquiler de Estrategias: desde $99/mes\n\nTodos los precios incluyen soporte y actualizaciones. ¿Necesitas ayuda con algún producto específico?';
  }

  if (msg.includes('python') || msg.includes('programar')) {
    return 'No necesitas saber programar para empezar. Ofrecemos:\n\n• Cursos desde nivel principiante\n• StrategyQuant (sin código)\n• Soporte paso a paso\n\n¿Te gustaría empezar con nuestro curso de Python para Trading?';
  }

  // Default response
  return 'Gracias por tu pregunta. Para darte la mejor respuesta, te recomiendo:\n\n1. Contactar a nuestro equipo por WhatsApp\n2. Ver nuestro catálogo de cursos\n3. Agendar una llamada gratuita\n\n¿Hay algo más en lo que pueda ayudarte?';
}

// @desc    Get chat conversation suggestions
// @route   GET /api/chat/suggestions
// @access  Public
export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = [
      '¿Qué cursos ofrecen?',
      '¿Cómo funcionan las mentorías?',
      '¿Qué es StrategyQuant?',
      'Precios y planes',
      '¿Necesito saber programar?',
      'Información sobre el Club',
    ];

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
