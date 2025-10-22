import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import multer from 'multer';
import sharp from 'sharp';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

// File type definitions
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];

const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  document: 25 * 1024 * 1024, // 25MB
  avatar: 5 * 1024 * 1024 // 5MB
};

// Configure multer for different file types
const createMulterConfig = (uploadPath: string, maxSize: number) => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads', uploadPath);
      try {
        await mkdirAsync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error as Error, '');
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
      const uploadType = req.params.type || 'image';
      let allowedTypes: string[] = [];

      switch (uploadType) {
        case 'image':
        case 'avatar':
          allowedTypes = ALLOWED_IMAGE_TYPES;
          break;
        case 'video':
          allowedTypes = ALLOWED_VIDEO_TYPES;
          break;
        case 'document':
          allowedTypes = ALLOWED_DOCUMENT_TYPES;
          break;
        default:
          return cb(new Error('Invalid upload type'));
      }

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
      }
    }
  });
};

// Image upload and processing
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const upload = createMulterConfig('images', MAX_FILE_SIZE.image).single('image');
    
    upload(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.file) {
        return next(new AppError('No image file provided', 400));
      }

      const { compress = true, width, height, quality = 80 } = req.query;
      
      try {
        let processedFilePath = req.file.path;

        // Process image if compression or resizing is requested
        if (compress === 'true' && ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
          const outputPath = req.file.path.replace(path.extname(req.file.path), '_processed.jpg');
          
          let sharpImage = sharp(req.file.path).jpeg({ quality: Number(quality) });
          
          if (width || height) {
            sharpImage = sharpImage.resize({
              width: width ? Number(width) : undefined,
              height: height ? Number(height) : undefined,
              fit: 'inside',
              withoutEnlargement: true
            });
          }

          await sharpImage.toFile(outputPath);
          
          // Remove original file and use processed one
          await unlinkAsync(req.file.path);
          processedFilePath = outputPath;
          req.file.path = outputPath;
          req.file.filename = path.basename(outputPath);
        }

        const fileUrl = `/uploads/images/${req.file.filename}`;
        const fileInfo = {
          originalName: req.file.originalname,
          filename: req.file.filename,
          path: processedFilePath,
          url: fileUrl,
          mimetype: req.file.mimetype,
          size: req.file.size,
          uploadedBy: req.user?.id,
          uploadedAt: new Date()
        };

        const response: ApiResponse<{ path: string; file: any }> = {
          success: true,
          data: { path: fileUrl, file: fileInfo },
          message: 'Image uploaded successfully'
        };

        res.status(200).json(response);
      } catch (processingError) {
        // Clean up uploaded file if processing fails
        if (req.file?.path && fs.existsSync(req.file.path)) {
          await unlinkAsync(req.file.path).catch(console.error);
        }
        throw processingError;
      }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Avatar upload with automatic resizing
export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const upload = createMulterConfig('avatars', MAX_FILE_SIZE.avatar).single('avatar');
    
    upload(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.file) {
        return next(new AppError('No avatar file provided', 400));
      }

      try {
        // Always process avatars to standard size
        const outputPath = req.file.path.replace(path.extname(req.file.path), '_avatar.jpg');
        
        await sharp(req.file.path)
          .resize(200, 200, { fit: 'cover' })
          .jpeg({ quality: 90 })
          .toFile(outputPath);

        // Remove original file
        await unlinkAsync(req.file.path);

        const fileUrl = `/uploads/avatars/${path.basename(outputPath)}`;
        const fileInfo = {
          originalName: req.file.originalname,
          filename: path.basename(outputPath),
          url: fileUrl,
          mimetype: 'image/jpeg',
          size: fs.statSync(outputPath).size,
          uploadedBy: req.user?.id,
          uploadedAt: new Date()
        };

        const response: ApiResponse<{ file: any }> = {
          success: true,
          data: { file: fileInfo },
          message: 'Avatar uploaded successfully'
        };

        res.status(200).json(response);
      } catch (processingError) {
        // Clean up uploaded file if processing fails
        if (req.file?.path && fs.existsSync(req.file.path)) {
          await unlinkAsync(req.file.path).catch(console.error);
        }
        throw processingError;
      }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Video upload
export const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Create specific multer config for videos
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
        try {
          await mkdirAsync(uploadDir, { recursive: true });
          cb(null, uploadDir);
        } catch (error) {
          cb(error as Error, '');
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `video-${uniqueSuffix}${ext}`);
      }
    });

    const upload = multer({
      storage,
      limits: { fileSize: MAX_FILE_SIZE.video },
      fileFilter: (req, file, cb) => {
        // Always validate as video for this endpoint
        if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_VIDEO_TYPES.join(', ')}`));
        }
      }
    }).single('video');
    
    upload(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.file) {
        return next(new AppError('No video file provided', 400));
      }

      const fileUrl = `/uploads/videos/${req.file.filename}`;
      const fileInfo = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        url: fileUrl,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user?.id,
        uploadedAt: new Date()
      };

      const response: ApiResponse<{ path: string; file: any }> = {
        success: true,
        data: { path: fileUrl, file: fileInfo },
        message: 'Video uploaded successfully'
      };

      res.status(200).json(response);
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Document upload
export const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const upload = createMulterConfig('documents', MAX_FILE_SIZE.document).single('document');
    
    upload(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.file) {
        return next(new AppError('No document file provided', 400));
      }

      const fileUrl = `/uploads/documents/${req.file.filename}`;
      const fileInfo = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        url: fileUrl,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user?.id,
        uploadedAt: new Date()
      };

      const response: ApiResponse<{ file: any }> = {
        success: true,
        data: { file: fileInfo },
        message: 'Document uploaded successfully'
      };

      res.status(200).json(response);
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Multiple files upload
export const uploadMultipleFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type = 'image' } = req.params;
    let maxSize = MAX_FILE_SIZE.image;
    
    switch (type) {
      case 'video':
        maxSize = MAX_FILE_SIZE.video;
        break;
      case 'document':
        maxSize = MAX_FILE_SIZE.document;
        break;
    }

    const upload = createMulterConfig(type + 's', maxSize).array('files', 10); // Max 10 files
    
    upload(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return next(new AppError('No files provided', 400));
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        const fileUrl = `/uploads/${type}s/${file.filename}`;
        const fileInfo = {
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          url: fileUrl,
          mimetype: file.mimetype,
          size: file.size,
          uploadedBy: req.user?.id,
          uploadedAt: new Date()
        };
        uploadedFiles.push(fileInfo);
      }

      const response: ApiResponse<{ files: any[] }> = {
        success: true,
        data: { files: uploadedFiles },
        message: `${uploadedFiles.length} files uploaded successfully`
      };

      res.status(200).json(response);
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Delete file
export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;
    const { type = 'images' } = req.query;

    if (!filename) {
      return next(new AppError('Filename is required', 400));
    }

    const filePath = path.join(process.cwd(), 'uploads', type as string, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return next(new AppError('File not found', 404));
    }

    // Delete the file
    await unlinkAsync(filePath);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'File deleted successfully' },
      message: 'File deleted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get file info
export const getFileInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;
    const { type = 'images' } = req.query;

    if (!filename) {
      return next(new AppError('Filename is required', 400));
    }

    const filePath = path.join(process.cwd(), 'uploads', type as string, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return next(new AppError('File not found', 404));
    }

    const stats = fs.statSync(filePath);
    const fileInfo = {
      filename,
      path: filePath,
      url: `/uploads/${type}/${filename}`,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    };

    const response: ApiResponse<{ file: any }> = {
      success: true,
      data: { file: fileInfo },
      message: 'File info retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get upload limits and allowed types
export const getUploadConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = {
      maxFileSizes: MAX_FILE_SIZE,
      allowedTypes: {
        image: ALLOWED_IMAGE_TYPES,
        video: ALLOWED_VIDEO_TYPES,
        document: ALLOWED_DOCUMENT_TYPES
      },
      maxFiles: {
        multiple: 10,
        single: 1
      }
    };

    const response: ApiResponse<{ config: any }> = {
      success: true,
      data: { config },
      message: 'Upload configuration retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};