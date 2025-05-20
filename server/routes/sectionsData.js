const express = require('express');
const router = express.Router();
const sectionDataController = require('../controllers/sectionDataController');

/*
 @route   POST /biSectionData/
 @desc    Clone a section
 */
router.post('/', sectionDataController.getSectionData);

module.exports = router;