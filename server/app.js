const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Contact Center Dashboard API.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

module.exports = app;