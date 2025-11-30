const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }
    
    const safeUri = uri.replace(/:(.*)@/, ':****@');
    console.log(`📊 Connection: ${safeUri}`);
    
    const connectionOptions = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(uri, connectionOptions);
    
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
  } catch (err) {
    console.error('❌ MongoDB Atlas connection failed:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose connected to MongoDB Atlas');
});

module.exports = connectDB;