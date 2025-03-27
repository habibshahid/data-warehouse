const ContactCenterStats = require('../models/contactCenterStats.model');
const AgentStats = require('../models/agentStats.model');
const { isValidDate } = require('../utils/dateUtils');

/**
 * Controller for dashboard data endpoints
 */
exports.getDashboardData = async (req, res) => {
  try {
    // Extract query parameters with default values
    const {
      reportType = 'contact_center',
      timeInterval = 'daily',
      startDate,
      endDate,
      channel = 'all',
      queue = 'all',
      agent = 'all',
      metrics = 'inbound,outbound,answeredInbound',
      groupBy = 'none'
    } = req.query;
    
    // Validate inputs
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date and end date are required'
      });
    }
    
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    // Parse metrics array
    const metricsArray = metrics.split(',');
    
    // Call the appropriate model based on the report type
    let data;
    if (reportType === 'agent') {
      data = await AgentStats.getDashboardData(
        reportType,
        timeInterval,
        startDate,
        endDate,
        channel,
        queue,
        agent,
        metricsArray,
        groupBy
      );
    } else { // default to contact_center
      data = await ContactCenterStats.getDashboardData(
        reportType,
        timeInterval,
        startDate,
        endDate,
        channel,
        queue,
        agent,
        metricsArray,
        groupBy
      );
    }
    
    res.status(200).json({
      status: 'success',
      data: data
    });
  } catch (error) {
    console.error('Error in getDashboardData controller:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};