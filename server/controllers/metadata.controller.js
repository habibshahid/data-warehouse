const ContactCenterStats = require('../models/contactCenterStats.model');
const AgentStats = require('../models/agentStats.model');

/**
 * Controller for metadata related endpoints
 */
exports.getMetadata = async (req, res) => {
  try {
    // Get the report type from query params
    const { reportType } = req.query;
    
    let metadata;
    
    if (reportType === 'agent') {
      metadata = await AgentStats.getMetadata();
    } else { // default to contact_center
      metadata = await ContactCenterStats.getMetadata();
    }
    
    res.status(200).json({
      status: 'success',
      data: metadata
    });
  } catch (error) {
    console.error('Error in getMetadata controller:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch metadata',
      error: error.message
    });
  }
};