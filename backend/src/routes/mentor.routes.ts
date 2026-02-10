import { Router } from 'express';
import multer from 'multer';
import { getMentors, getMentor, uploadMentorPhoto } from '../controllers/mentor.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Configurar multer para manejar uploads en memoria
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo aceptar imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

/**
 * @route   GET /api/mentors
 * @desc    Get all mentors
 * @access  Public
 */
router.get('/', getMentors);

/**
 * @route   GET /api/mentors/:id
 * @desc    Get single mentor
 * @access  Public
 */
router.get('/:id', getMentor);

/**
 * @route   POST /api/mentors/upload-photo
 * @desc    Upload mentor photo to Supabase Storage
 * @access  Protected (Admin only)
 */
router.post('/upload-photo', protect, authorize('admin'), upload.single('photo'), uploadMentorPhoto);

export default router;
