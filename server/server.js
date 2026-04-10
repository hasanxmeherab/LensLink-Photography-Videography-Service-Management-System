const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://diulenslink.vercel.app',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Increase timeout for large file uploads
app.use((req, res, next) => {
  req.setTimeout(600000); // 10 minutes
  res.setTimeout(600000); // 10 minutes
  next();
});

// MongoDB Connection
connectDB();

// Basic route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to LensLink API' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));

// Error handling middleware
app.use(errorHandler);

// Initialize and start server
(async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Set server timeout for large uploads (10 minutes)
    server.timeout = 600000;
    server.keepAliveTimeout = 650000;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

module.exports = app;
