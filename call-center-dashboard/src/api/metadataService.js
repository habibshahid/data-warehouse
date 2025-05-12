// src/api/metadataService.js
import api from './index';

// Function to fetch available queues
export const fetchQueues = async () => {
  try {
    const response = await api.get('/metadata/queues');
    return response.data;
  } catch (error) {
    console.error('Error fetching queues:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch queues');
  }
};

// Function to fetch available channels
export const fetchChannels = async () => {
  try {
    const response = await api.get('/metadata/channels');
    return response.data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch channels');
  }
};

// Function to fetch available metrics based on time interval
export const fetchAvailableMetrics = async (timeInterval) => {
  try {
    // Map time interval to table name
    const tableMap = {
      '15min': 'yovo_tbl_call_center_stats_15_min',
      '30min': 'yovo_tbl_contact_center_stats_half_hourly',
      'hourly': 'yovo_tbl_contact_center_stats_hourly',
      'daily': 'yovo_tbl_contact_center_stats_daily',
      'monthly': 'yovo_tbl_contact_center_stats_monthly',
      'yearly': 'yovo_tbl_contact_center_stats_yearly',
    };
    
    const tableName = tableMap[timeInterval] || 'yovo_tbl_contact_center_stats_daily';
    
    const response = await api.get('/metadata/metrics', {
      params: { tableName },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching available metrics:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch available metrics');
  }
};