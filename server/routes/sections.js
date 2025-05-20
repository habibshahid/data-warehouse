const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

/*
 @route   GET /biSections/dashboard/:dashboardId
 @desc    Get all sections for a specific dashboard
 */
router.get('/dashboard/:dashboardId', sectionController.getSectionsByDashboard);

/*
 @route   GET /biSections/:id
 @desc    Get section by ID
 */
router.get('/:id', sectionController.getSection);

/*
 @route   POST /biSections/
 @desc    Create a new section
 */
router.post('/', sectionController.createSection);

/*
 @route   PUT /biSections/:id/layout
 @desc    Update section layout
 */
router.put('/layout', sectionController.updateLayout);

/*
 @route   PUT /biSections/layouts
 @desc    Update multiple section layouts in bulk
 */
router.put('/layouts', sectionController.updateLayouts);

/*
 @route   PUT /biSections/:id
 @desc    Update section
 */
router.put('/:id', sectionController.updateSection);

/*
 @route   DELETE /biSections/:id
 @desc    Delete section
 */
router.delete('/:id', sectionController.deleteSection);

/*
 @route   POST /biSections/:id/clone
 @desc    Clone a section
 */
router.post('/:id/clone', sectionController.cloneSection);

module.exports = router;