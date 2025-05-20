import api from './index';

/**
 * Fetch data for a section based on parameters
 * @param {Object} params - Section data parameters
 * @returns {Promise} - Promise that resolves with the section data
 */
export const fetchSectionData = async (params) => {
  try {

    console.log("Fetching section data with params:", params);

    // Ensure required fields exist
    const requestParams = {
      sectionId: params.sectionId,
      timeInterval: params.timeInterval || 'daily',
      startDate: params.startDate,
      endDate: params.endDate,
      columns: params.columns || [],
      filters: params.filters || { queues: [], channels: [] },
      groupBy: params.groupBy,
      advancedFilters: params.advancedFilters,
      visualizationType: params.visualizationType
    };

    const response = await api.post('/api/sectionData', requestParams);

    console.log(`Received data for section ${params.sectionId}:`, {
      recordCount: response.data.data.length,
      timeInterval: response.data.timeInterval
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching section data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch section data');
  }
};

/**
 * Update a section with new data and refresh
 * @param {string} sectionId - ID of the section to update
 * @param {Object} updateData - Data to update on the section
 * @param {Object} queryParams - Parameters to fetch new data after update
 * @returns {Promise} - Promise that resolves with the updated section and data
 */
export const updateSectionAndRefresh = async (sectionId, updateData, queryParams) => {
  try {
    console.log(`Updating section ${sectionId} and refreshing data:`, updateData);

    // First update the section
    const updateResponse = await api.put(`/biSections/${sectionId}`, updateData);

    if (!updateResponse.data.success) {
      throw new Error('Failed to update section');
    }

    // Then fetch new data with the updated section settings
    const dataParams = {
      sectionId,
      ...queryParams,
      ...updateData // Include the updated settings in the data fetch
    };

    const data = await fetchSectionData(dataParams);

    return {
      section: updateResponse.data.updatedSection,
      data
    };
  } catch (error) {
    console.error('Error updating section and refreshing data:', error);
    throw new Error(error.response?.data?.message || 'Failed to update section and refresh data');
  }
};