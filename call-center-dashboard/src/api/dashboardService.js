// src/api/dashboardService.js
import api from './index';
import moment from 'dayjs';

// Function to fetch dashboard data based on parameters
export const fetchDashboardData = async (params) => {
  try {
    // Log the incoming parameters for debugging
    console.log('DASHBOARD API - Original params:', params);
    
    // Ensure columns is an array and not empty
    let columnsToUse = params.columns;
    
    // Debug columns specifically
    console.log('DASHBOARD API - Original columns:', columnsToUse);
    
    // Determine which date/time column to use based on time interval
    let dateColumn;
    switch (params.timeInterval) {
      case '15min':
      case '30min':
      case 'hourly':
      case 'daily':
        dateColumn = 'timeInterval';
        break;
      case 'monthly':
        dateColumn = 'pKey';
        break;
      case 'yearly':
        dateColumn = 'timeInterval';
        break;
      default:
        dateColumn = 'timeInterval';
    }
    
    // Create a copy of the columns and ensure dateColumn is included
    columnsToUse = [...(params.columns || [])].filter(col => 
      // Filter out 'period' as it's a computed field, not a database column
      col !== 'period'
    );
    
    // For the yearly table, also filter out 'year' as it doesn't exist (timeInterval is the year)
    if (params.timeInterval === 'yearly') {
      columnsToUse = columnsToUse.filter(col => col !== 'year');
    }
    
    // Always ensure the date column is included
    if (!columnsToUse.includes(dateColumn)) {
      columnsToUse.push(dateColumn);
    }
    
    // Create a valid params object to send to the API
    const apiParams = {
      timeInterval: params.timeInterval,
      startDate: params.startDate,
      endDate: params.endDate,
      
      // CRITICAL: Make sure columns are sent correctly
      columns: Array.isArray(columnsToUse) && columnsToUse.length > 0 
               ? [...columnsToUse] // Create new array to avoid reference issues
               : ['*'], // Use wildcard if no columns
      
      // CRITICAL: Include all filters
      filters: {
        queues: Array.isArray(params.filters?.queues) ? [...params.filters.queues] : [],
        channels: Array.isArray(params.filters?.channels) ? [...params.filters.channels] : [],
      },
      
      // Include groupBy if specified
      groupBy: params.groupBy,
      
      // Include visualization type for reference
      visualizationType: params.visualizationType,
      
      // Include section ID for reference
      sectionId: params.sectionId,
      
      // Include advanced filters if specified
      advancedFilters: params.advancedFilters || null
    };
    
    // Log the final API parameters
    console.log('DASHBOARD API - Final API params:', apiParams);
    console.log('DASHBOARD API - Final columns:', apiParams.columns);
    
    // Send the parameters to the backend
    const response = await api.post('/dashboard/data', apiParams);
    
    // Log the response structure (not the full data)
    console.log(`DASHBOARD API - Response received: ${response.data.length} records`);
    
    // Format the data to ensure it has a 'period' field for charts
    const formattedData = formatData(response.data, params.timeInterval);
    
    // Process data for visualization types that need multiple data points
    let processedData = [...formattedData];
    
    // If there's only one data point but we need a visualization that requires multiple points
    if (formattedData.length === 1 && 
        (params.visualizationType === 'pie' || 
         params.visualizationType === 'bar' || 
         params.visualizationType === 'line')) {
      
      console.log('DASHBOARD API - Processing single data point for visualization:', params.visualizationType);
      
      // For pie charts with a single data point, we'll handle this in the ChartSection component
      // For line and bar charts with a single data point, we'll also handle in the component
      
      // Additional metadata to help the front-end understand this is a single data point
      processedData[0]._isSingleDataPoint = true;
    }
    
    return processedData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
};

// Format data to ensure it has a 'period' field that's properly formatted for display
// Updated formatData function in dashboardService.js
const formatData = (data, timeInterval) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map((row, index) => {
    let periodLabel;
    let dateField;
    
    // Determine which field contains the date/time data
    switch (timeInterval) {
      case '15min':
      case '30min':
        dateField = 'timeInterval';
        // Preserve the full timestamp for 15min and 30min intervals
        periodLabel = row[dateField] ? row[dateField] : null;
        break;
      case 'hourly':
        dateField = 'timeInterval';
        // Preserve the full hourly timestamp
        periodLabel = row[dateField] ? row[dateField] : null;
        break;
      case 'daily':
        dateField = 'timeInterval';
        // Preserve the full date
        periodLabel = row[dateField] ? row[dateField] : null;
        break;
      case 'monthly':
        dateField = 'pKey';
        // Preserve the YYYY-MM format
        periodLabel = row[dateField] ? row[dateField] : null;
        break;
      case 'yearly':
        dateField = 'timeInterval';
        // Preserve the YYYY format
        periodLabel = row[dateField] ? row[dateField] : null;
        break;
      default:
        dateField = 'timeInterval';
        periodLabel = row[dateField] || null;
    }
    
    return {
      ...row,
      period: periodLabel || `Period ${index + 1}`,
      key: index // Add a key for React lists
    };
  });
};

// Function to save dashboard configuration
export const saveDashboard = async (dashboardConfig) => {
  try {
    const response = await api.post('/dashboard/save', dashboardConfig);
    return response.data;
  } catch (error) {
    console.error('Error saving dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to save dashboard');
  }
};

// Function to load a saved dashboard by ID
export const loadDashboard = async (dashboardId) => {
  try {
    const response = await api.get(`/dashboard/${dashboardId}`);
    return response.data;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to load dashboard');
  }
};

// Function to list saved dashboards
export const listDashboards = async () => {
  try {
    const response = await api.get('/dashboard/list');
    return response.data;
  } catch (error) {
    console.error('Error listing dashboards:', error);
    throw new Error(error.response?.data?.message || 'Failed to list dashboards');
  }
};

// Function to delete a dashboard
export const deleteDashboard = async (dashboardId) => {
  try {
    await api.delete(`/dashboard/${dashboardId}`);
    return true;
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete dashboard');
  }
};