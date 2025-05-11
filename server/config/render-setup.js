/**
 * Render deployment setup helper
 * This script helps configure the application for Render deployment
 */

const fs = require('fs');
const path = require('path');

/**
 * Detects if the application is running on Render
 * @returns {boolean} True if running on Render
 */
const isRenderEnvironment = () => {
  return !!process.env.RENDER || !!process.env.IS_RENDER || fs.existsSync('/opt/render');
};

/**
 * Sets up environment variables for Render
 */
const setupRenderEnvironment = () => {
  if (isRenderEnvironment()) {
    console.log('🚀 Setting up Render environment');
    
    // Set default port for Render
    if (!process.env.PORT) {
      process.env.PORT = 10000;
      console.log('📌 Set default PORT to 10000 for Render');
    }
    
    // Set RENDER flag
    process.env.RENDER = 'true';
    
    // Log environment info
    console.log(`📊 Environment: Render`);
    console.log(`📊 Port: ${process.env.PORT}`);
    console.log(`📊 MongoDB URI: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing'}`);
  }
};

module.exports = {
  isRenderEnvironment,
  setupRenderEnvironment
};