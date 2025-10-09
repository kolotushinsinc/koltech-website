import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Настройка хранилища для загруженных файлов
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Генерация уникального имени файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Фильтр для проверки типа файла
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Проверка на тип изображения
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только изображения!'));
  }
};

// Настройка загрузки
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Ограничение размера файла: 10MB (увеличено с 5MB)
    files: 11 // Максимум 11 файлов (1 главное изображение + 10 для предпросмотра)
  }
});

// Обработчик ошибок загрузки файлов
export const handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'Размер файла превышает допустимый лимит (10MB)'
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Превышено максимальное количество файлов'
      });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Неожиданное поле файла'
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Ошибка при загрузке файлов'
    });
  }
  next();
};

// Экспорт middleware для загрузки изображений проекта
export const uploadProjectImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'previewImages', maxCount: 10 }
]);