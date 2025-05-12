// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

// Create the context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // State for the theme mode (light, dark, system)
  const [themeMode, setThemeMode] = useState('light');
  
  // State for primary color
  const [primaryColor, setPrimaryColor] = useState('#1890ff');
  
  // Determine if we should use dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Effect to handle system preference changes
  useEffect(() => {
    // If theme is set to system, check the system preference
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Update state based on current preference
      setIsDarkMode(mediaQuery.matches);
      
      // Add listener for changes
      const handleChange = (e) => {
        setIsDarkMode(e.matches);
      };
      
      // Attach the listener
      mediaQuery.addEventListener('change', handleChange);
      
      // Clean up
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Set based on explicit theme choice
      setIsDarkMode(themeMode === 'dark');
    }
  }, [themeMode]);
  
  // Function to update theme mode
  const updateThemeMode = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('themeMode', mode);
  };
  
  // Function to update primary color
  const updatePrimaryColor = (color) => {
    setPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
  };
  
  // Load saved theme settings from localStorage on initial load
  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode');
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    
    if (savedThemeMode) {
      setThemeMode(savedThemeMode);
    }
    
    if (savedPrimaryColor) {
      setPrimaryColor(savedPrimaryColor);
    }
  }, []);
  
  // Create the Ant Design theme configuration
  const themeConfig = {
    algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
    },
  };
  
  // Context value
  const contextValue = {
    themeMode,
    primaryColor,
    isDarkMode,
    updateThemeMode,
    updatePrimaryColor,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Hook for easy access to the theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};