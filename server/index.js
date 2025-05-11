require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import Render setup helper
const renderSetup = require('./config/render-setup');

// Configure for Render environment if needed
renderSetup.setupRenderEnvironment();

// Import routes
const authRoutes = require('./routes/auth');
const scrapingRoutes = require('./routes/scraping');
const userRoutes = require('./routes/users');
const convertRoutes = require('./routes/convert');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 10000; // Default to port 10000 for Render

// Middleware
app.use(cors());
app.use(express.json());

// Import database connection
const connectDB = require('./config/db');

// Connect to MongoDB
if (process.env.RENDER) {
  // Enhanced retry logic for Render deployment
  const connectWithRetry = async (retryCount = 0, maxRetries = 5) => {
    try {
      console.log(`MongoDB connection attempt ${retryCount + 1}/${maxRetries + 1}`);
      await connectDB();
    } catch (err) {
      if (retryCount < maxRetries) {
        const retryDelay = Math.min(5000 * Math.pow(1.5, retryCount), 30000); // Exponential backoff with 30s max
        console.log(`MongoDB connection failed, retrying in ${retryDelay/1000} seconds...`);
        console.log(`Error details: ${err.message}`);
        setTimeout(() => connectWithRetry(retryCount + 1, maxRetries), retryDelay);
      } else {
        console.error('Maximum MongoDB connection attempts reached. Please check your connection string and network.');
        // Continue app startup even if MongoDB fails - the app will handle missing DB gracefully
      }
    }
  };
  connectWithRetry();
} else {
  connectDB();
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scrape', scrapingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/convert', convertRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Check for Render.com environment
  const clientPath = process.env.RENDER ? '/opt/render/project/src/client/dist' : path.join(__dirname, '../client/dist');
  
  // Add a health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Add a status endpoint for auth service
  app.get('/api/auth/status', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Ensure the client directory exists before serving static files
  const fs = require('fs');
  if (fs.existsSync(clientPath)) {
    app.use(express.static(clientPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(clientPath, 'index.html'));
    });
  } else {
    console.warn(`Static file directory not found: ${clientPath}`);
    // Handle API routes only if client directory doesn't exist
    app.get('*', (req, res) => {
      res.status(404).json({ message: 'Frontend not deployed. Please access the API endpoints directly.' });
    });
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT} and host ${HOST}`);
  console.log(`Render deployment: ${process.env.RENDER ? 'Yes' : 'No'}`);
});