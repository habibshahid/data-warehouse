const { BiDashboards: Dashboard, BiSections: Section } = require('../models');
const mongoose = require('mongoose');

// Get all dashboards with filtering
exports.getDashboards = async (req, res) => {

  try {

    console.log(req.user)

    // Build query based on search, category, and favorite
    const query = { ownerId: req.user.id };

    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter favorites if requested
    if (req.query.favorite === 'true') {
      query.favorite = true;
    }

    // Get dashboards with pagination
    const dashboards = await Dashboard.find(query)
      .select('name description category favorite createdAt updatedAt')
      .sort({ updatedAt: -1 })

    res.json({
      status: true,
      dashboards
    });
  }
  catch (err) {
    console.error('Error fetching dashboards:', err);
    res.status(500).json({ status: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Get dashboard by ID
exports.getDashboard = async (req, res) => {
  try {

    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check if user has access to this dashboard
    if (dashboard?.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You dont have permission to retrieve this dashboard' }
      });
    }

    res.json({ success: true, dashboard });
  }
  catch (err) {
    console.error('Error fetching dashboard:', err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Create a new dashboard
exports.createDashboard = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, error: { message: 'Name is required' } });
    }

    // Create new dashboard
    const dashboard = new Dashboard({
      name,
      description: description || '',
      category: category || null,
      favorite: false, // Default to not favorite
      ownerId: req.user.id,
      owner: req.user
    });

    // Save dashboard
    const savedDashboard = await dashboard.save();

    res.status(201).json({ success: true, savedDashboard });
  }
  catch (err) {
    console.error('Error creating dashboard:', err);
    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Update dashboard
exports.updateDashboard = async (req, res) => {
  try {
    const { name, description, category, favorite } = req.body;

    // Find dashboard
    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check ownership
    if (dashboard?.ownerId !== req?.user?.id) {
      return res.status(403).json({
        success: false,
        error: { message: "You dont have permission to retrieve this dashboard" }
      });
    }

    // Update fields
    if (name !== undefined) dashboard.name = name;
    if (description !== undefined) dashboard.description = description;
    if (category !== undefined) dashboard.category = category;
    if (favorite !== undefined) dashboard.favorite = favorite;

    // Save updated dashboard
    const updatedDashboard = await dashboard.save();

    res.json({ success: true, updatedDashboard });
  }
  catch (err) {
    console.error('Error updating dashboard:', err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Toggle dashboard favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check ownership
    if (dashboard?.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { message: "You dont have permission to retrieve this dashboard" }
      });
    }

    // Toggle favorite status
    dashboard.favorite = !dashboard.favorite;

    // Save updated dashboard
    const updatedDashboard = await dashboard.save();

    res.json({
      success: true,
      updatedDashboard,
    });
  }
  catch (err) {
    console.error('Error toggling favorite:', err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Delete dashboard (no auto-delete of sections)
exports.deleteDashboard = async (req, res) => {
  try {
    // Find dashboard
    const dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check ownership
    if (dashboard?.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { message: "You dont have permission to retrieve this dashboard" }
      });
    }

    // Delete the dashboard
    await Dashboard.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Dashboard deleted successfully' });
  }
  catch (err) {
    console.error('Error deleting dashboard:', err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Clone a dashboard (also clone its sections)
exports.cloneDashboard = async (req, res) => {
  try {

    // Find source dashboard
    const sourceDashboard = await Dashboard.findById(req.params.id);

    if (!sourceDashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check ownership
    if (sourceDashboard?.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { message: "You dont have permission to retrieve this dashboard" }
      });
    }

    // Create new dashboard (clone)
    const newDashboard = new Dashboard({
      name: `${ sourceDashboard.name } (Copy)`,
      description: sourceDashboard.description,
      category: sourceDashboard.category,
      favorite: false, // Default to not favorite for cloned dashboards
      ownerId: req.user.id,
      owner: req.user
    });

    // Save the new dashboard
    const savedDashboard = await newDashboard.save();

    // Find all sections from source dashboard
    const sourceSections = await Section.find({
      dashboardId: sourceDashboard._id
    })

    // Clone each section
    if (sourceSections.length > 0) {
      const newSections = sourceSections.map(section => ({
        dashboardId: savedDashboard._id,
        title: section.title,
        name: section.name,
        visualizationType: section.visualizationType,
        modelType: section.modelType,
        columns: section.columns,
        filters: section.filters,
        filtersString: section.filtersString,
        groupBy: section.groupBy,
        files: section.files,
        layout: section.layout,
        chartOptions: section.chartOptions,
        order: section.order
      }));

      // Insert all new sections
      await Section.insertMany(newSections);
    }

    res.status(201).json({
      success: true,
      message: 'Dashboard cloned successfully',
      dashboard: savedDashboard,
      sectionsCloned: sourceSections.length
    });
  }
  catch (err) {
    console.error('Error cloning dashboard:', err);

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};