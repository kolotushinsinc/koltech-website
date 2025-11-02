import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import MediasoupService from './services/MediasoupService';
import { SocketHandler } from './services/SocketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration - allow connections from any origin for WebRTC
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware - allow connections from any origin for WebRTC
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Kolophone Server' });
});

// Initialize services
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Initialize mediasoup workers
    await MediasoupService.initialize(1);

    // Setup Socket.IO handlers
    const socketHandler = new SocketHandler(io);
    io.on('connection', (socket) => {
      socketHandler.handleConnection(socket);
    });

    // Start server
    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎥  Kolophone Server Running                           ║
║                                                           ║
║   📡  Port: ${PORT}                                        ║
║   🌐  Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}              ║
║   🗄️   MongoDB: Connected                                 ║
║   🎬  Mediasoup: Ready                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

startServer();
