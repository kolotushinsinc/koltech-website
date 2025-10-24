import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { protect } from '../middleware/auth.js';
import {
  uploadAndProcessVideo,
  cancelVideoUpload,
  extractThumbnail
} from '../controllers/videoController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/videos'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// Upload and process video with progress
router.post('/upload', protect, upload.single('video'), uploadAndProcessVideo);

// Cancel video upload
router.delete('/upload/:videoId', protect, cancelVideoUpload);

// Extract thumbnail
router.post('/thumbnail', protect, upload.single('video'), extractThumbnail);

export default router;
