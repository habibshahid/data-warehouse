// src/api/dashboardService.js
import api from './index';

// Function to fetch dashboard data based on parameters
export const fetchDashboardData = async (params) => {
  try {
    // Log the incoming parameters for debugging
    console.log('DASHBOARD API - Original params:', params);
    
    // Ensure columns is an array and not empty
    let columnsToUse = params.columns;
    
    // Debug columns specifically
    console.log('DASHBOARD API - Original columns:', columnsToUse);
    
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
      sectionId: params.sectionId
    };
    
    // Log the final API parameters
    console.log('DASHBOARD API - Final API params:', apiParams);
    console.log('DASHBOARD API - Final columns:', apiParams.columns);
    
    // Send the parameters to the backend
    const response = await api.post('/dashboard/data', apiParams);
    
    // Log the response structure (not the full data)
    console.log(`DASHBOARD API - Response received: ${response.data.length} records`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
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