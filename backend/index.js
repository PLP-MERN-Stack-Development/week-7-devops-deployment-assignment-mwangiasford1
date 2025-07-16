const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = express();

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

app.use(express.json());

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
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error details:', error);
  });

// Routes
const itemsRouter = require('./routes/items');

// API endpoints
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/items', itemsRouter);

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/api`);
  });
}

module.exports = app; 