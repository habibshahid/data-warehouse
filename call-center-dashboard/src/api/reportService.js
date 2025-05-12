// src/api/reportService.js
import api from './index';

// Function to generate a report based on parameters
export const generateReport = async (reportParams) => {
  try {
    const response = await api.post('/reports/generate', reportParams);
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate report');
  }
};

// Function to download a report in a specific format (e.g., PDF, Excel)
export const downloadReport = async (reportId, format) => {
  try {
    const response = await api.get(`/reports/${reportId}/download`, {
      params: { format },
      responseType: 'blob', // Important for file download
    });
    
    // Create a URL for the file blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a temporary anchor element and trigger a download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${reportId}.${format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading report:', error);
    throw new Error(error.response?.data?.message || 'Failed to download report');
  }
};

// Function to schedule a recurring report
export const scheduleReport = async (reportConfig) => {
  try {
    const response = await api.post('/reports/schedule', reportConfig);
    return response.data;
  } catch (error) {
    console.error('Error scheduling report:', error);
    throw new Error(error.response?.data?.message || 'Failed to schedule report');
  }
};

// Function to list scheduled reports
export const listScheduledReports = async () => {
  try {
    const response = await api.get('/reports/scheduled');
    return response.data;
  } catch (error) {
    console.error('Error listing scheduled reports:', error);
    throw new Error(error.response?.data?.message || 'Failed to list scheduled reports');
  }
};