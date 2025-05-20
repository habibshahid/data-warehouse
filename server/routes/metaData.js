const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadataController');

/*
 @route   GET /biMetadata/queues
 @desc    Get all queues
 */
router.get('/queues', metadataController.getQueues)

/*
 @route   GET /biMetadata/channels
 @desc    Get channels
 */
router.get('/channels', metadataController.getChannels);

/*
 @route   GET /biMetadata/attributes
 @desc    Get attributes for all data models
 */
  router.get('/attributes', metadataController.getBiAttributes);


module.exports = router;