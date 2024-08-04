// Importing required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const stockRouter = require('./routers/stock');
const { fetchDataAndSave } = require('./controller/stock');
const cron = require('node-cron');
const connectDB = require('./db/db-properties');

// Load environment variables from .env file, if available
dotenv.config();

// Creating an instance of express
const app = express();
app.use(express.json());

// Determine the port based on environment
const port = process.env.DEV_PORT || 4001;

// Middleware setup
app.use(cors()); // Enable CORS for all routes


connectDB();
// Routes
// app.use('/api',(req, res, next) => {
//   console.log('Request received:', req.method, req.url);
//   next();
// }, stockRouter);
require('./routers/stock')(app)
// Schedule the task to run every few seconds (e.g., every 1 Day)
cron.schedule('0 0 * * *', fetchDataAndSave);

// Additional CORS headers (optional, since 'cors' package covers this)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
