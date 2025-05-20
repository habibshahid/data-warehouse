import api from './index';

/**
 * Fetch all available queues
 * @returns {Promise<Array>} - Array of queue objects with value and label properties
 */
export const fetchQueues = async () => {
  try {
    const response = await api.get('/biMetadata/queues');
    return response.data?.queues || [];
  }
  catch (error) {
    console.error('Error fetching queues:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch queues');
  }
};

/**
 * Fetch all available channels
 * @returns {Promise<Array>} - Array of channel objects with value and label properties
 */
export const fetchChannels = async () => {
  try {
    const response = await api.get('/biMetadata/channels');
    return response.data?.channels || [];
  }
  catch (error) {
    console.error('Error fetching channels:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch channels');
  }
};

/**
 * Fetch available metrics based on the time interval
 * @param {string} timeInterval - Time interval to fetch metrics for
 * @returns {Promise<Array>} - Array of metric objects with value and label properties
 */
export const fetchAvailableMetrics = async () => {
  try {
    const response = await api.get('/biMetadata/attributes');
    return response?.data || {};
  }
  catch (error) {
    console.error('Error fetching available metrics:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch available metrics');
  }
};