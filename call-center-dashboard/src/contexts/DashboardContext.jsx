import React, { createContext, useReducer, useEffect } from 'react';
import { message } from 'antd';

// Define the initial state for the dashboard
const initialState = {
  timeInterval: 'daily', // Options: 15min, 30min, hourly, daily, monthly, yearly
  dateRange: [null, null], // [startDate, endDate]
  selectedColumns: [], // REMOVE FROM MAIN FILTERS - No longer needed at global level
  filters: {
    queues: [], // Selected queues for filtering
    channels: [], // Selected channels for filtering
  },
  groupBy: null, // 'queue' or 'channel' or null
  sections: [], // List of dashboard sections/widgets
  isLoading: false,
  error: null,
  availableMetadata: {
    queues: [],
    channels: [],
    metrics: [], // Available columns/metrics based on selected timeInterval
  },
};

// Define action types
const ActionTypes = {
  SET_TIME_INTERVAL: 'SET_TIME_INTERVAL',
  SET_DATE_RANGE: 'SET_DATE_RANGE',
  SET_SELECTED_COLUMNS: 'SET_SELECTED_COLUMNS', // Keep for backward compatibility
  SET_FILTERS: 'SET_FILTERS',
  SET_GROUP_BY: 'SET_GROUP_BY',
  ADD_SECTION: 'ADD_SECTION',
  UPDATE_SECTION: 'UPDATE_SECTION',
  REMOVE_SECTION: 'REMOVE_SECTION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_METADATA: 'SET_METADATA',
  LOAD_SAVED_DASHBOARD: 'LOAD_SAVED_DASHBOARD',
};

// Deep clone helper to avoid reference issues
const deepClone = (obj) => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error("Unable to deep clone object:", e);
    // Fallback to shallow clone
    if (Array.isArray(obj)) {
      return [...obj];
    }
    return { ...obj };
  }
};

// Debug function to log state differences
const logStateDiff = (prevState, newState) => {
  console.log('State change detected:');
  
  // Check sections differences
  if (prevState.sections.length !== newState.sections.length) {
    console.log(`Sections count changed: ${prevState.sections.length} -> ${newState.sections.length}`);
  } else {
    newState.sections.forEach((newSection, index) => {
      const prevSection = prevState.sections[index];
      if (prevSection) {
        if (prevSection.visualizationType !== newSection.visualizationType) {
          console.log(`Section ${newSection.id} visualization type changed: ${prevSection.visualizationType} -> ${newSection.visualizationType}`);
        }
        if (JSON.stringify(prevSection.columns) !== JSON.stringify(newSection.columns)) {
          console.log(`Section ${newSection.id} columns changed`);
        }
      }
    });
  }
};

// Reducer function to handle state updates
const dashboardReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case ActionTypes.SET_TIME_INTERVAL:
      newState = { ...state, timeInterval: action.payload };
      break;
      
    case ActionTypes.SET_DATE_RANGE:
      newState = { ...state, dateRange: action.payload };
      break;
      
    case ActionTypes.SET_SELECTED_COLUMNS:
      // Keep for backward compatibility but we won't use it anymore
      newState = { ...state, selectedColumns: action.payload };
      break;
      
    case ActionTypes.SET_FILTERS:
      newState = { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
      break;
      
    case ActionTypes.SET_GROUP_BY:
      newState = { ...state, groupBy: action.payload };
      break;
      
    case ActionTypes.ADD_SECTION:
      console.log("ADD_SECTION action received:", action.payload);
      // Make sure we deep clone the section to avoid reference issues
      const newSection = deepClone(action.payload);
      newState = { 
        ...state, 
        sections: [...state.sections, newSection] 
      };
      break;
      
    case ActionTypes.UPDATE_SECTION:
      console.log("UPDATE_SECTION action received:", action.payload);
      // Deep clone to avoid reference issues
      const updatedSection = deepClone(action.payload);
      
      newState = {
        ...state,
        sections: state.sections.map(section => {
          if (section.id === updatedSection.id) {
            // Log any important changes
            if (section.visualizationType !== updatedSection.visualizationType) {
              console.log(`Section ${section.id} visualization type updating: ${section.visualizationType} -> ${updatedSection.visualizationType}`);
            }
            
            // Create a completely new section object to avoid reference issues
            return updatedSection;
          }
          return section;
        })
      };
      break;
      
    case ActionTypes.REMOVE_SECTION:
      newState = {
        ...state,
        sections: state.sections.filter(section => section.id !== action.payload)
      };
      break;
      
    case ActionTypes.SET_LOADING:
      newState = { ...state, isLoading: action.payload };
      break;
      
    case ActionTypes.SET_ERROR:
      newState = { ...state, error: action.payload };
      break;
      
    case ActionTypes.SET_METADATA:
      newState = { 
        ...state, 
        availableMetadata: { ...state.availableMetadata, ...action.payload } 
      };
      break;
      
    case ActionTypes.LOAD_SAVED_DASHBOARD:
      // Make sure to deep clone the loaded state to avoid reference issues
      const loadedState = deepClone(action.payload);
      newState = { ...state, ...loadedState };
      break;
      
    default:
      return state;
  }
  
  // Debug: Log significant state changes
  logStateDiff(state, newState);
  
  return newState;
};

// Create the context
export const DashboardContext = createContext();

// Create the provider component
export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  
  // Save dashboard state to localStorage when it changes
  useEffect(() => {
    try {
      // Don't save loading and error states
      const { isLoading, error, ...dashboardState } = state;
      localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
      console.log('Dashboard state saved to localStorage, sections count:', dashboardState.sections.length);
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    }
  }, [state]);
  
  // Load saved dashboard state on initial load
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('dashboardState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log('Loading saved dashboard state from localStorage, sections count:', parsedState.sections.length);
        
        // For each section, log the visualization type
        if (parsedState.sections) {
          parsedState.sections.forEach(section => {
            console.log(`Loaded section ${section.id}, type: ${section.visualizationType}`);
          });
        }
        
        dispatch({ 
          type: ActionTypes.LOAD_SAVED_DASHBOARD, 
          payload: parsedState
        });
      }
    } catch (error) {
      console.error('Failed to load saved dashboard state:', error);
      message.error('Failed to load saved dashboard configuration');
    }
  }, []);
  
  // Define action creators
  const setTimeInterval = (interval) => {
    dispatch({ type: ActionTypes.SET_TIME_INTERVAL, payload: interval });
  };
  
  const setDateRange = (range) => {
    dispatch({ type: ActionTypes.SET_DATE_RANGE, payload: range });
  };
  
  const setSelectedColumns = (columns) => {
    dispatch({ type: ActionTypes.SET_SELECTED_COLUMNS, payload: columns });
  };
  
  const setFilters = (filters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
  };
  
  const setGroupBy = (groupBy) => {
    dispatch({ type: ActionTypes.SET_GROUP_BY, payload: groupBy });
  };
  
  const addSection = (section) => {
    console.log("Adding section:", section);
    // Make sure the section has all required fields
    const completeSection = {
      id: section.id,
      title: section.title || 'New Section',
      visualizationType: section.visualizationType || 'table',
      columns: section.columns || [],
      filters: {
        queues: section.filters?.queues || [],
        channels: section.filters?.channels || [],
      },
      groupBy: section.groupBy || null,
      data: section.data || null,
      layout: section.layout || {
        x: 0,
        y: 0,
        w: 12,
        h: 6
      },
      chartOptions: section.chartOptions || {
        showLegend: true,
        showDataLabels: false,
        horizontal: false,
        animate: true,
      },
      created: section.created || new Date().toISOString(),
      lastUpdated: section.lastUpdated || null,
    };
    
    dispatch({ type: ActionTypes.ADD_SECTION, payload: completeSection });
  };
  
  const updateSection = (section) => {
    console.log("Updating section:", section.id, "type:", section.visualizationType);
    // Make sure the section has all the required fields to prevent overrides
    const completeSection = {
      ...section,
      // Ensure these fields exist to prevent them from being lost
      visualizationType: section.visualizationType || 'table',
      columns: section.columns || [],
      filters: section.filters || {
        queues: [],
        channels: [],
      },
      chartOptions: section.chartOptions || {
        showLegend: true,
        showDataLabels: false,
        horizontal: false,
        animate: true,
      },
    };
    
    dispatch({ type: ActionTypes.UPDATE_SECTION, payload: completeSection });
  };
  
  const removeSection = (sectionId) => {
    dispatch({ type: ActionTypes.REMOVE_SECTION, payload: sectionId });
  };
  
  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };
  
  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };
  
  const setMetadata = (metadata) => {
    dispatch({ type: ActionTypes.SET_METADATA, payload: metadata });
  };
  
  const value = {
    ...state,
    setTimeInterval,
    setDateRange,
    setSelectedColumns,
    setFilters,
    setGroupBy,
    addSection,
    updateSection,
    removeSection,
    setLoading,
    setError,
    setMetadata,
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;