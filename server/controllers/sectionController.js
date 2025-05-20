const { BiDashboards: Dashboard, BiSections: Section } = require('../models');

// Get all sections for a specific dashboard
exports.getSectionsByDashboard = async (req, res) => {
  try {
    const { dashboardId } = req.params;

    // Filter by dashboard if provided
    if (!dashboardId) {
      return res.status(400).json({ success: false, error: { message: 'Dashboard ID is required' } });
    }

    // Verify dashboard exists and user has access
    const dashboard = await Dashboard.findById(dashboardId);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    if (dashboard?.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { message: "You don't have permission to retrieve this dashboard" }
      });
    }

    // Get all sections for this dashboard
    const sections = await Section.find({ dashboardId })

    res.json({ success: true, sections });
  }
  catch (err) {
    console.error('Error fetching sections by dashboard:', err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Get a specific section
exports.getSection = async (req, res) => {
  try {

    const { id } = req.params;

    // Find section
    const section = await Section.findById(id);

    if (!section) {
      return res.status(404).json({ success: false, error: { message: 'Section not found' } });
    }

    // Check if user has access to the parent dashboard
    const dashboard = await Dashboard.findById(section?.dashboardId);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check if user has access to this dashboard
    if (dashboard.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { message: "You dont have permission to retrieve this dashboard sections" }
      });
    }

    res.json({ success: true, section });

  }
  catch (err) {
    console.error('Error fetching section:', err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: { message: 'Section not found' } });
    }

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Create a new section
exports.createSection = async (req, res) => {
  try {
    const {
      dashboardId,
      title,
      visualizationType,
      modelType,
      columns,
      filters,
      filtersString,
      groupBy,
      files,
      layout,
      chartOptions,
    } = req.body;

    // Validate required fields
    if (!dashboardId) {
      return res.status(400).json({ success: false, error: { message: 'Dashboard ID is required' } });
    }

    // Check if dashboard exists and user has access
    const dashboard = await Dashboard.findById(dashboardId);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check if user has access to this dashboard
    if (dashboard.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }

    // Calculate order if not provided

    // let sectionOrder = order;
    // if (sectionOrder === undefined) {
    //   // Get the highest order value and add 1
    //   const lastSection = await Section.findOne({ dashboardId })
    //     .sort({ order: -1 })
    //     .limit(1);
    //
    //   sectionOrder = lastSection ? lastSection.order + 1 : 0;
    // }

    // Create new section
    const section = new Section({
      dashboardId,
      title: title || 'New Section',
      visualizationType: visualizationType || null,
      modelType: modelType || null,
      columns: columns || [],
      filters: filters || {},
      queryString: filtersString || null,
      groupBy: groupBy || null,
      files: files || [],
      layout: layout || { x: 0, y: 0, w: 12, h: 6 },
      chartOptions: chartOptions || {
        type: null,
        showLegend: true,
        showDataLabels: false,
        horizontal: false,
        animate: true,
        options: {}
      },
    });

    // Save section
    const savedSection = await section.save();

    await dashboard.save();

    res.status(201).json({ success: true, savedSection });
  }
  catch (err) {
    console.error('Error creating section:', err);

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Update a section
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      name,
      visualizationType,
      modelType,
      columns,
      filters,
      filtersString,
      groupBy,
      files,
      layout,
      chartOptions,
      order
    } = req.body;

    // Find section
    const section = await Section.findById(id);

    if (!section) {
      return res.status(404).json({ success: false, error: { message: 'Section not found' } });
    }

    // Check if user has access to the parent dashboard
    const dashboard = await Dashboard.findById(section?.dashboardId);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check if user has access to this dashboard
    if (dashboard.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }

    // Update fields
    if (title !== undefined) section.title = title;
    if (name !== undefined) section.name = name;
    if (visualizationType !== undefined) section.visualizationType = visualizationType;
    if (modelType !== undefined) section.modelType = modelType;
    if (columns !== undefined) section.columns = columns;
    if (filters !== undefined) section.filters = filters;
    if (filtersString !== undefined) section.queryString = filtersString;
    if (groupBy !== undefined) section.groupBy = groupBy;
    if (files !== undefined) section.files = files;
    if (layout !== undefined) section.layout = layout;
    if (chartOptions !== undefined) section.chartOptions = chartOptions;
    if (order !== undefined) section.order = order;

    // Save updated section
    const updatedSection = await section.save();

    res.json({ success: true, updatedSection });
  }
  catch (err) {
    console.error('Error updating section:', err);
    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Delete a section
exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    // Find section
    const section = await Section.findById(id);

    if (!section) {
      return res.status(404).json({ success: false, error: { message: 'Section not found' } });
    }

    // Check if user has access to the parent dashboard
    const dashboard = await Dashboard.findById(section?.dashboardId);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check if user has access to this dashboard
    if (dashboard.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }

    // Delete section
    await Section.findByIdAndDelete(id);

    res.json({ success: true, message: 'Section deleted successfully' });
  }
  catch (err) {
    console.error('Error deleting section:', err);

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Update section layout
exports.updateLayout = async (req, res) => {
  try {
    console.log('heeheheh')
    const { layout } = req.body;

    console.log(layout)

    // Validate required fields
    if (!layout) {
      return res.status(400).json({ success: false, error: { message: 'Layout is required' } });
    }

    for (const layoutElement of layout) {

      console.log(layoutElement)

      const section = await Section.findById(id);



    }

    // Find section

    if (!section) {
      return res.status(404).json({ success: false, error: { message: 'Section not found' } });
    }

    // Check if user has access to the parent dashboard
    const dashboard = await Dashboard.findById(section?.dashboardId);

    if (!dashboard) {
      return res.status(404).json({ success: false, error: { message: 'Dashboard not found' } });
    }

    // Check if user has access to this dashboard
    if (dashboard.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }

    // Update layout
    section.layout = layout;

    // Save updated section
    const updatedSection = await section.save();

    res.json({ success: true, updatedSection });
  }
  catch (err) {
    console.error('Error updating section layout:', err);
    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Update multiple section layouts in bulk
exports.updateLayouts = async (req, res) => {
  try {

    console.log('jeddddddddddddddddddddddd')
    const { layouts } = req.body;

    // Validate required fields
    if (!layouts || !Array.isArray(layouts)) {
      return res.status(400).json({ success: false, error: { message: 'Layouts array is required' } });
    }

    console.log(layouts)

    // Process each layout update
    const updatePromises = layouts.map(async (item) => {
      if (!item.id || !item.layout) return null;

      // Find the section
      const section = await Section.findById(item.id);
      if (!section) return null;

      // Check user has access to this section's dashboard
      const dashboard = await Dashboard.findById(section.dashboardId);
      if (!dashboard || dashboard.ownerId.toString() !== req.user.id) return null;

      // Update the layout
      return Section.findOneAndUpdate(
        { _id: item.id },
        {
          layout: item.layout
        },
        { new: true }
      );
    });

    // Execute all updates
    const results = await Promise.all(updatePromises);

    // Filter out null results
    const updatedSections = results.filter(Boolean);

    res.json({
      success: true,
      message: `${ updatedSections.length } section layouts updated`,
      sections: updatedSections
    });
  }
  catch (err) {
    console.error('Error updating section layouts:', err);
    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};

// Clone a section
exports.cloneSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { dashboardId } = req.body; // Optional target dashboard ID

    // Find section to clone
    const section = await Section.findById(id);

    if (!section) {
      return res.status(404).json({ success: false, error: { message: 'Section not found' } });
    }

    // Check if user has access to the source dashboard
    const sourceDashboard = await Dashboard.findById(section.dashboardId);

    if (!sourceDashboard) {
      return res.status(404).json({ success: false, error: { message: 'Source dashboard not found' } });
    }

    if (sourceDashboard.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: 'Access denied to source dashboard' } });
    }

    // Determine target dashboard
    const targetDashboardId = dashboardId || section.dashboardId;

    // If cloning to a different dashboard, check access
    if (targetDashboardId !== section.dashboardId.toString()) {
      const targetDashboard = await Dashboard.findById(targetDashboardId);

      if (!targetDashboard) {
        return res.status(404).json({ success: false, error: { message: 'Target dashboard not found' } });
      }

      if (targetDashboard.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, error: { message: 'Access denied to target dashboard' } });
      }
    }

    // // Calculate order for the new section
    // const lastSection = await Section.findOne({ dashboardId: targetDashboardId })
    //   .sort({ order: -1 })
    //   .limit(1);

    // Create new section (clone)
    const newSection = new Section({
      dashboardId: targetDashboardId,
      title: `${ section.title } (Copy)`,
      visualizationType: section.visualizationType,
      modelType: section.modelType,
      columns: section.columns,
      filters: section.filters,
      queryString: section.filtersString,
      groupBy: section.groupBy,
      files: section.files,
      layout: {
        ...section.layout,
        // Adjust position if same dashboard
        y: section.layout.y + (targetDashboardId === section.dashboardId.toString() ? 2 : 0)
      },
      chartOptions: section.chartOptions,
    });

    // Save new section
    const savedSection = await newSection.save();

    res.status(201).json(savedSection);
  }
  catch (err) {
    console.error('Error cloning section:', err);

    res.status(500).json({ success: false, error: { message: 'Server error', reason: err.message } });
  }
};