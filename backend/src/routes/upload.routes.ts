import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { uploadLessonMedia as uploadMiddleware, handleMulterError } from '../middleware/upload.middleware';
import { uploadLimiter } from '../middleware/payment-limiter.middleware';
import {
  uploadLessonMedia,
  deleteLessonMedia,
  getFileInfo
} from '../controllers/upload.controller';

const router = Router();

// Todas las rutas requieren autenticación de admin
router.use(protect, authorize('admin'));

// Subir archivo multimedia
router.post(
  '/lesson-media',
  uploadLimiter,
  uploadMiddleware.single('file'),
  handleMulterError,
  uploadLessonMedia
);

// Eliminar archivo
router.delete('/lesson-media/:filename', deleteLessonMedia);

// Obtener información del archivo
router.get('/lesson-media/:filename', getFileInfo);

export default router;
