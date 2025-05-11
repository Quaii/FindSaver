const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    // Enhanced options for Render deployment
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: process.env.RENDER ? 30000 : 5000, // Longer timeout for Render
      socketTimeoutMS: process.env.RENDER ? 60000 : 45000, // Longer timeout for Render
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
    };

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, options);

    const conn = mongoose.connection;
    conn.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    conn.once('open', () => {
      console.log(`MongoDB Connected: ${conn.host}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Exit process with failure if unable to connect to database
    process.exit(1);
  }
};

module.exports = connectDB;