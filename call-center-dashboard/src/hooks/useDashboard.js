import { useContext, useCallback, useRef } from 'react';
import { DashboardContext } from '../contexts/DashboardContext';
import { fetchDashboardData } from '../api/dashboardService';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid'; // Add uuid dependency for better IDs

// Utility for deep cloning objects
const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error("Unable to deep clone object:", e);
    return { ...obj }; // Fallback to shallow clone
  }
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  const { 
    timeInterval, 
    dateRange, 
    selectedColumns, 
    filters,
    groupBy,
    sections,
    isLoading,
    setLoading,
    setError,
    addSection,
    updateSection,
    removeSection,
  } = context;
  
  // Use a ref to track sections that are currently being fetched to avoid duplicate fetches
  const fetchingSections = useRef({});
  
  // Function to fetch data for a specific section
  const fetchSectionData = useCallback(async (sectionId) => {
    // Skip if this section is already being fetched
    if (fetchingSections.current[sectionId]) {
      return null;
    }

    try {
      setLoading(true);
      // Mark this section as being fetched
      fetchingSections.current[sectionId] = true;
      
      const section = sections.find(s => s.id === sectionId);
      
      if (!section) {
        throw new Error('Section not found');
      }
      
      // Use ONLY section-specific settings, not global settings
      const params = {
        timeInterval,
        startDate: dateRange[0],
        endDate: dateRange[1],
        // Use only section columns, fall back to empty array if none
        columns: section.columns || [],
        filters: {
          // Use only section filters, fall back to empty arrays if none
          queues: section.filters?.queues || [],
          channels: section.filters?.channels || [],
        },
        // Use only section groupBy
        groupBy: section.groupBy || null,
        visualizationType: section.visualizationType,
      };
      
      console.log('Fetching data with params for section:', sectionId, params);
      
      const data = await fetchDashboardData(params);
      
      // Update section with fetched data
      updateSection({
        ...section,
        data,
        lastUpdated: new Date().toISOString(),
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching section data:', error);
      setError(error.message || 'Failed to fetch data');
      message.error('Failed to fetch data for section');
      return null;
    } finally {
      // Clear the fetching flag for this section
      delete fetchingSections.current[sectionId];
      setLoading(false);
    }
  }, [timeInterval, dateRange, sections, setLoading, setError, updateSection]);
  
  // Function to refresh all sections
  const refreshDashboard = useCallback(async () => {
    // Skip if already loading
    if (isLoading) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Clear any existing error
      setError(null);
      
      if (sections.length === 0) {
        // No sections to refresh
        message.info('No sections to refresh');
        return;
      }
      
      // Reset the fetching sections tracker
      fetchingSections.current = {};
      
      // Use Promise.all to fetch data for all sections in parallel
      await Promise.all(
        sections.map(section => fetchSectionData(section.id))
      );
      
      message.success('Dashboard refreshed successfully');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      setError(error.message || 'Failed to refresh dashboard');
      message.error('Failed to refresh dashboard');
    } finally {
      setLoading(false);
    }
  }, [sections, fetchSectionData, setLoading, setError, isLoading]);
  
  // Function to create a new section with default settings
  const createSection = useCallback((sectionConfig) => {
    // Calculate new position for the section
    // Find the existing sections' positions to avoid overlap
    const existingSections = sections || [];
    let nextY = 0;
    
    if (existingSections.length > 0) {
      // Find the maximum y + height to place the new section below existing ones
      nextY = existingSections.reduce((maxY, section) => {
        const sectionBottom = (section.layout?.y || 0) + (section.layout?.h || 4);
        return Math.max(maxY, sectionBottom);
      }, 0);
    }
    
    // Create new section with default settings
    const newSection = {
      id: `section-${Date.now()}`,
      title: sectionConfig.title || 'New Section',
      visualizationType: sectionConfig.visualizationType || 'table',
      // Initialize with empty settings
      columns: [], 
      filters: {
        queues: [],
        channels: [],
      },
      groupBy: null,
      data: null,
      layout: {
        x: 0,
        y: nextY,
        w: 12,
        h: 4
      },
      created: new Date().toISOString(),
      lastUpdated: null,
    };
    
    console.log('Adding section with defaults:', newSection);
    addSection(newSection);
    
    return newSection;
  }, [addSection, sections]);
  
  const updateSectionAndRefresh = useCallback(async (updatedSection) => {
    try {
      // Update section settings
      updateSection(updatedSection);
      
      // Refresh data for this section with new settings
      await fetchSectionData(updatedSection.id);
      
      return true;
    } catch (error) {
      console.error('Error updating section and refreshing data:', error);
      message.error('Failed to update section settings');
      return false;
    }
  }, [updateSection, fetchSectionData]);

  // Function to delete a section
  const deleteSection = useCallback((sectionId) => {
    removeSection(sectionId);
    message.success('Section removed');
  }, [removeSection]);
  
  return {
    ...context,
    fetchSectionData,
    refreshDashboard,
    createSection,
    updateSectionAndRefresh,
    deleteSection,
    isLoading,
  };
};

export default useDashboard;