const express = require('express');
const app = express();
const mongoose = require('mongoose');

const artistRoutes = require('../api/routes/artists');
const songRoutes = require('../api/routes/songs');

/**
 * Middleware
 */

// Parsing JSON request
app.use(express.json());

// Parsing (similar to body-parser)
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  }
  next();
});

// HTTP GET for checking is server is up
app.get('/', (req, res, next) => {
  res.status(200).json({
    message: `Service is up!`,
    method: req.method,
  });
});

// Routes
app.use('/artists', artistRoutes);
app.use('/songs', songRoutes);

// Error Handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGODBURL)
  .catch((err) => (err ?     
console.error(`Error: ${err.message}`) : console.log(`MongoDB connection successful`)));

module.exports = app;
