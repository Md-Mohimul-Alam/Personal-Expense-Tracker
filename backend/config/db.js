const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For MongoDB Atlas, use the connection string directly
    // No need for separate auth object
    await mongoose.connect(process.env.MONGODB_URI, {
      // These options are sufficient for MongoDB Atlas
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    console.log('💡 Make sure your MONGODB_URI in .env file is correct');
    process.exit(1);
  }
};

module.exports = connectDB;