import api from './index';

// Function to fetch dashboard data based on parameters
export const fetchDashboardData = async (params) => {
  try {
    // Send the parameters to the backend
    const response = await api.post('/dashboard/data', params);
    
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