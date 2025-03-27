const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const metadataController = require('../controllers/metadata.controller');

// Metadata routes
router.get('/metadata', metadataController.getMetadata);

// Dashboard data routes
router.get('/dashboard', dashboardController.getDashboardData);

module.exports = router;