require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// CORS
app.use(cors({
  origin: ['https://personal-expense-tracker-henna.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Initialize database
connectDB();

// Routes
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Test endpoint
app.get('/test', async (req, res) => {
  try {
    // Test database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    res.json({
      message: 'Server is working!',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Personal Expense Tracker API 🚀',
    version: '1.0.0',
    database: 'MongoDB Local',
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Server Started Successfully');
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Database: MongoDB Local`);
  console.log('='.repeat(50));
});