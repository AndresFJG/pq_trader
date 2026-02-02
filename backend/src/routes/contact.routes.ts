import express from 'express';
import { sendContactEmail } from '../controllers/contact.controller';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter para evitar spam (máximo 3 mensajes por hora por IP)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: {
    success: false,
    error: 'Demasiados mensajes enviados. Por favor, espera una hora antes de intentar de nuevo.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/contact - Enviar mensaje de contacto
router.post('/', contactLimiter, sendContactEmail);

export default router;
