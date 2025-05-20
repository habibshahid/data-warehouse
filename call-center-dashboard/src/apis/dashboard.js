// src/api/dashboardService.js
import api from './index';

// List all dashboards
export const listDashboards = async (page = 1, limit = 20, search = '', category = '', favorite = false) => {
  try {
    const response = await api.get('/biDashboards');
    return response.data;
  }
  catch (error) {
    console.error('Error listing dashboards:', error);
    throw new Error(error.response?.data?.message || 'Failed to list dashboards');
  }
};

// Get dashboard by ID
export const getDashboard = async (dashboardId) => {
  try {
    const response = await api.get(`/biDashboards/${ dashboardId }`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard');
  }
};

// Create a new dashboard
export const createDashboard = async (dashboardData) => {
  try {
    const response = await api.post('/biDashboards', dashboardData);
    return response.data;
  }
  catch (error) {
    console.error('Error creating dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to create dashboard');
  }
};

// Update dashboard
export const updateDashboard = async (dashboardId, dashboardData) => {
  try {
    const response = await api.put(`/biDashboards/${ dashboardId }`, dashboardData);
    return response.data;
  }
  catch (error) {
    console.error('Error updating dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to update dashboard');
  }
};

// Toggle dashboard favorite status
export const toggleFavorite = async (dashboardId) => {
  try {
    const response = await api.put(`/biDashboards/${ dashboardId }/favorite`);
    return response.data;
  }
  catch (error) {
    console.error('Error toggling dashboard favorite:', error);
    throw new Error(error.response?.data?.message || 'Failed to toggle favorite');
  }
};

// Delete dashboard
export const deleteDashboard = async (dashboardId) => {
  try {
    const response = await api.delete(`/biDashboards/${ dashboardId }`);
    return response.data;
  }
  catch (error) {
    console.error('Error deleting dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete dashboard');
  }
};

// Clone dashboard
export const cloneDashboard = async (dashboardId) => {
  try {
    const response = await api.post(`/biDashboards/${ dashboardId }/clone`);
    return response.data;
  }
  catch (error) {
    console.error('Error cloning dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to clone dashboard');
  }
};