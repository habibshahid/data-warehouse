const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

/*
 @route   GET /biDashboards
 @desc    Get all dashboards
 */
router.get('/', dashboardController.getDashboards)

/*
 @route   GET /biDashboards/:id
 @desc    Get dashboard by ID
 */
router.get('/:id', dashboardController.getDashboard);

/*
 @route    POST /biDashboards
 @desc    Create a new dashboard
 */
router.post('/', dashboardController.createDashboard);

/*
 @route   PUT /biDashboards/:id
 @desc     Update dashboard
 */
router.put('/:id', dashboardController.updateDashboard);

/*
 @route   PUT /biDashboards/:id/favorite
 @desc    Toggle dashboard favorite status
 */
router.put('/:id/favorite', dashboardController.toggleFavorite);

/*
 @route   DELETE /biDashboards/:id
 @desc     Delete dashboard
 */
router.delete('/:id', dashboardController.deleteDashboard);

/*
 @route   POST /biDashboards/:id/clone
 @desc    Clone dashboard
 */
router.post('/:id/clone', dashboardController.cloneDashboard);

module.exports = router;