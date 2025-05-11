const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

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