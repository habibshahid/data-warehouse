import React, { createContext, useReducer, useEffect } from 'react';
import { message } from 'antd';

// Define the initial state for the dashboard
const initialState = {
  timeInterval: 'daily', // Options: 15min, 30min, hourly, daily, monthly, yearly
  dateRange: [null, null], // [startDate, endDate]
  selectedColumns: [], // List of columns selected for display
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
  SET_SELECTED_COLUMNS: 'SET_SELECTED_COLUMNS',
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

// Reducer function to handle state updates
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_TIME_INTERVAL:
      return { ...state, timeInterval: action.payload };
    case ActionTypes.SET_DATE_RANGE:
      return { ...state, dateRange: action.payload };
    case ActionTypes.SET_SELECTED_COLUMNS:
      return { ...state, selectedColumns: action.payload };
    case ActionTypes.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    case ActionTypes.SET_GROUP_BY:
      return { ...state, groupBy: action.payload };
    case ActionTypes.ADD_SECTION:
      return { 
        ...state, 
        sections: [...state.sections, action.payload] 
      };
    case ActionTypes.UPDATE_SECTION:
      console.log("UPDATE_SECTION action received:", action.payload);
      return {
        ...state,
        sections: state.sections.map(section => 
          section.id === action.payload.id ? action.payload : section
        )
      };
    case ActionTypes.REMOVE_SECTION:
      return {
        ...state,
        sections: state.sections.filter(section => section.id !== action.payload)
      };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.SET_METADATA:
      return { 
        ...state, 
        availableMetadata: { ...state.availableMetadata, ...action.payload } 
      };
    case ActionTypes.LOAD_SAVED_DASHBOARD:
      return { ...state, ...action.payload };
    default:
      return state;
  }
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
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    }
  }, [state]);
  
  // Load saved dashboard state on initial load
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('dashboardState');
      if (savedState) {
        dispatch({ 
          type: ActionTypes.LOAD_SAVED_DASHBOARD, 
          payload: JSON.parse(savedState) 
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
    dispatch({ type: ActionTypes.ADD_SECTION, payload: section });
  };
  
  const updateSection = (section) => {
    console.log("Updating section:", section);
    dispatch({ type: ActionTypes.UPDATE_SECTION, payload: section });
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