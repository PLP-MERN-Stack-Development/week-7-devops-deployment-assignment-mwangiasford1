const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = express();

// Import middleware
const {
  requestLogger,
  securityHeaders,
  compressionMiddleware,
  rateLimiter,
  apiRateLimiter,
  healthCheck,
  performanceMonitor,
  errorLogger
} = require('./middleware/monitoring');

// CORS configuration for development and production
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'https://mern-task-manager-frontend-u45r.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply middleware
app.use(securityHeaders);
app.use(compressionMiddleware);
app.use(requestLogger);
app.use(performanceMonitor);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mwangiasford12:<db_password>@project.ju5j3qr.mongodb.net/?retryWrites=true&w=majority&appName=project';

console.log('Attempting to connect to MongoDB...');
console.log('URI:', MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@')); // Hide credentials in logs

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  bufferCommands: false, // Disable mongoose buffering
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    app.locals.dbStatus = 'connected';
    // Only start the server after successful DB connection
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🔗 API base: http://localhost:${PORT}/api`);
        console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
        console.log(`📝 Items endpoints: http://localhost:${PORT}/api/items`);
      });
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error details:', error);
    app.locals.dbStatus = 'disconnected';
    // Optionally, exit the process if DB connection fails
    process.exit(1);
  });

// Routes
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');

// Health check endpoint (before rate limiting)
app.get('/health', healthCheck);

// API rate limiting for API routes
app.use('/api', apiRateLimiter);

// API endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running!',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      items: '/api/items',
      health: '/health'
    },
    documentation: 'Check the README for API documentation'
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    availableEndpoints: {
      auth: '/api/auth',
      items: '/api/items',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled error:', err);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app; 