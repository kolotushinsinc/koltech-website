import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './utils/database.js';
import { setupSocketIO } from './services/socketService.js';
import { ensureDefaultWallsExist, createFreelanceSubcategories } from './utils/seedDefaultWalls.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postsRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import wallRoutes from './routes/wallRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import kolophoneRoutes from './routes/kolophoneRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5005;

// Security middleware (relaxed for development)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'unsafe-none' },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting (более мягкие ограничения)
const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 1000, // много запросов в минуту
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Пропускаем OPTIONS запросы от rate limiting
    return req.method === 'OPTIONS';
  }
});

app.use(limiter);

// Простая CORS настройка
app.use(cors({
  origin: true, // Разрешаем все origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cache-Control']
}));

// Compression
app.use(compression());

// Static files middleware (for uploads) - completely open
app.use('/uploads', express.static('uploads'));

// Body parsing middleware with enhanced error handling
app.use((req, res, next) => {
  // Log request details for debugging
  console.log(`📥 ${req.method} ${req.originalUrl} - IP: ${req.ip} - ${new Date().toISOString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2).substring(0, 500));
  }
  next();
});

app.use(express.json({
  limit: '10mb',
  strict: true,
  type: 'application/json'
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced error handling middleware for JSON parsing
app.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof SyntaxError && (error as any).status === 400 && 'body' in error) {
    console.error('❌ JSON Parse Error:', {
      message: error.message,
      url: req.originalUrl,
      method: req.method,
      headers: req.headers,
      rawBody: req.rawBody || 'No raw body available'
    });
    
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body. Please ensure you are sending valid JSON.',
      error: 'INVALID_JSON',
      details: 'Check that your request Content-Type is application/json and body is properly formatted'
    });
  }
  next(error);
});

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KolTech API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/walls', wallRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/kolophone', kolophoneRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/videos', videoRoutes);
// app.use('/api/admin', adminRoutes);

// Setup Socket.IO
setupSocketIO(io);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initialize default data
    console.log('🔧 Initializing default data...');
    await ensureDefaultWallsExist();
    await createFreelanceSubcategories();
    console.log('✅ Default data initialization complete');
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 KolTech API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`🏗️  Default walls and communities ready`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();

export { io };
