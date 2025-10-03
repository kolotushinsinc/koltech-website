import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import contactRoutes from './routes/contacts';

const app = express();
const PORT = process.env.PORT || 5006;

// Connect to Database
connectDB();

// Middleware
// app.use(cors()); // Просто разрешаем все без дополнительных настроек
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow all origins
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'X-HTTP-Method-Override'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});