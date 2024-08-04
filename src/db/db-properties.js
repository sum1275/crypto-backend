const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await mongoose.connect(process.env.DB_DEV_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to the database');
    } else {
      // You can add other environments here (e.g., production)
      console.error('Invalid NODE_ENV');
      process.exit(1);
    }
  } catch (err) {
    console.error('Database connection failure:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
