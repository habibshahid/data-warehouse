import api from './index';

// Fetch all sections for a dashboard
export const fetchSections = async (dashboardId) => {
  try {
    const response = await api.get(`/biSections/dashboard/${ dashboardId }`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching sections:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch sections');
  }
};

// Create a new section
export const createSection = async (sectionData) => {
  try {
    const response = await api.post('/biSections', sectionData);
    return response.data;
  }
  catch (error) {
    console.error('Error creating section:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to create section');
  }
};

// Update a section
export const updateSection = async (sectionId, sectionData) => {
  try {
    const response = await api.put(`/biSections/${ sectionId }`, sectionData);
    return response.data;
  }
  catch (error) {
    console.error('Error updating section:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to update section');
  }
};

// Delete a section
export const deleteSection = async (sectionId) => {
  try {
    const response = await api.delete(`/biSections/${ sectionId }`);
    return response.data;
  }
  catch (error) {
    console.error('Error deleting section:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to delete section');
  }
};

// Update section layout
export const updateSectionLayout = async (layout) => {
  try {
    const response = await api.put(`/biSections/layout`, { layout });
    return response.data;
  }
  catch (error) {
    console.error('Error updating section layout:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to update section layout');
  }
};

// Update multiple section layouts in bulk
export const updateLayouts = async (layouts) => {
  try {
    const response = await api.put('/biSections/layouts', { layouts });
    return response.data;
  }
  catch (error) {
    console.error('Error updating layouts:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to update layouts');
  }
};