import React, { useState, useEffect } from 'react';
import { Layout, Spin, Alert, Button, Modal } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import DashboardControls from './DashboardControls';
import DashboardGrid from './DashboardGrid';
import SectionSettings from '../sections/SectionSettings';

const { Content } = Layout;

const Dashboard = () => {
  // Local state for dashboard sections
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeInterval, setTimeInterval] = useState('daily');
  const [dateRange, setDateRange] = useState([null, null]);
  
  // State for new section modal
  const [newSection, setNewSection] = useState(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  
  // Load sections from localStorage on initial render
  useEffect(() => {
    try {
      const savedSections = localStorage.getItem('dashboardSections');
      if (savedSections) {
        // Ensure all sections have valid layouts
        const parsedSections = JSON.parse(savedSections).map(section => {
          // Make sure the layout property exists and has all required properties
          if (!section.layout) {
            section.layout = {
              x: 0,
              y: 0,
              w: 12,
              h: 6
            };
          } else {
            // Ensure all layout properties are defined
            section.layout = {
              x: section.layout.x ?? 0,
              y: section.layout.y ?? 0,
              w: section.layout.w ?? 12,
              h: section.layout.h ?? 6
            };
          }
          
          // Ensure section has a chart options object
          if (!section.chartOptions) {
            section.chartOptions = {
              showLegend: true,
              showDataLabels: false,
              horizontal: false,
              animate: true,
            };
          }
          
          // Ensure section has a filters object
          if (!section.filters) {
            section.filters = {
              queues: [],
              channels: []
            };
          }
          
          return section;
        });
        setSections(parsedSections);
      }
      
      // Load time interval and date range
      const savedTimeInterval = localStorage.getItem('timeInterval');
      if (savedTimeInterval) {
        setTimeInterval(savedTimeInterval);
      }
      
      const savedDateRange = localStorage.getItem('dateRange');
      if (savedDateRange) {
        setDateRange(JSON.parse(savedDateRange));
      }
    } catch (error) {
      console.error('Error loading dashboard state:', error);
      setError('Failed to load saved dashboard configuration');
    }
  }, []);
  
  // Save sections to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('dashboardSections', JSON.stringify(sections));
    } catch (error) {
      console.error('Error saving dashboard sections:', error);
    }
  }, [sections]);
  
  // Save time interval and date range when they change
  useEffect(() => {
    try {
      localStorage.setItem('timeInterval', timeInterval);
    } catch (error) {
      console.error('Error saving time interval:', error);
    }
  }, [timeInterval]);
  
  useEffect(() => {
    try {
      localStorage.setItem('dateRange', JSON.stringify(dateRange));
    } catch (error) {
      console.error('Error saving date range:', error);
    }
  }, [dateRange]);
  
  // Add a new section
  const handleAddSection = (section) => {
    // Ensure the section has a valid layout
    const newSection = {
      ...section,
      layout: {
        x: section.layout?.x ?? 0,
        y: section.layout?.y ?? 0,
        w: section.layout?.w ?? 12,
        h: section.layout?.h ?? 6
      },
      chartOptions: section.chartOptions || {
        showLegend: true,
        showDataLabels: false,
        horizontal: false,
        animate: true
      },
      filters: section.filters || {
        queues: [],
        channels: []
      }
    };
    setSections(prevSections => [...prevSections, newSection]);
  };
  
  // Update a section
  const handleUpdateSection = (updatedSection) => {
    // Ensure the updated section has a valid layout
    const sectionWithValidLayout = {
      ...updatedSection,
      layout: {
        x: updatedSection.layout?.x ?? 0,
        y: updatedSection.layout?.y ?? 0,
        w: updatedSection.layout?.w ?? 12,
        h: updatedSection.layout?.h ?? 6
      },
      // Ensure it has a chartOptions object
      chartOptions: updatedSection.chartOptions || {
        showLegend: true,
        showDataLabels: false,
        horizontal: false,
        animate: true
      },
      // Ensure it has a filters object
      filters: updatedSection.filters || {
        queues: [],
        channels: []
      }
    };
    
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === updatedSection.id ? sectionWithValidLayout : section
      )
    );
  };
  
  // Delete a section
  const handleDeleteSection = (sectionId) => {
    setSections(prevSections => 
      prevSections.filter(section => section.id !== sectionId)
    );
  };
  
  // Handle time interval change
  const handleTimeIntervalChange = (interval) => {
    setTimeInterval(interval);
  };
  
  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };
  
  // Refresh all sections
  const handleRefreshAll = () => {
    // This is handled by child components now
    // Just update the time to trigger a refresh
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  // Calculate the next Y position for a new section
  const calculateNextYPosition = () => {
    if (!sections || sections.length === 0) {
      return 0;
    }
    
    // Find the maximum y + height
    return sections.reduce((maxY, section) => {
      const sectionBottom = (section.layout?.y || 0) + (section.layout?.h || 6);
      return Math.max(maxY, sectionBottom);
    }, 0);
  };
  
  // Open settings for a new section
  const handleAddNewSection = () => {
    // Create a temporary section with default values
    const nextY = calculateNextYPosition();
    
    const tempSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      visualizationType: 'table',
      columns: [],
      filters: {
        queues: [],
        channels: [],
      },
      groupBy: null,
      layout: {
        x: 0,
        y: nextY,
        w: 12,
        h: 6
      },
      chartOptions: {
        showLegend: true,
        showDataLabels: false,
        horizontal: false,
        animate: true,
      },
      isNew: true // Flag to indicate this is a new section
    };
    
    // Store this temporary section
    setNewSection(tempSection);
    
    // Open settings modal for this new section
    setIsSettingsVisible(true);
  };
  
  // Handle saving new section settings
  const handleSaveNewSection = (configuredSection) => {
    // Remove the isNew flag
    const { isNew, ...sectionData } = configuredSection;
    
    // Calculate the next Y position
    const nextY = calculateNextYPosition();
    
    // Ensure the layout position is appropriate
    const newSectionFinal = {
      ...sectionData,
      layout: {
        ...sectionData.layout,
        x: 0,
        y: nextY,
        w: 12,
        h: 6
      },
    };
    
    // Add the section to the dashboard
    handleAddSection(newSectionFinal);
    
    // Close the settings modal
    setIsSettingsVisible(false);
    setNewSection(null);
  };
  
  // Handle canceling new section creation
  const handleCancelNewSection = () => {
    setIsSettingsVisible(false);
    setNewSection(null);
  };
  
  return (
    <Content style={{ padding: '0 16px', marginTop: 16 }}>
      {/* Dashboard controls */}
      <DashboardControls 
        timeInterval={timeInterval}
        dateRange={dateRange}
        onTimeIntervalChange={handleTimeIntervalChange}
        onDateRangeChange={handleDateRangeChange}
        onApplyFilters={handleRefreshAll}
      />
      
      <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ marginRight: 8 }}
            onClick={handleAddNewSection}
          >
            Add Section
          </Button>
          <Button 
            onClick={handleRefreshAll} 
            icon={<ReloadOutlined />}
            loading={isLoading}
          >
            Refresh All
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={() => setError(null)}
        />
      )}
      
      {isLoading && sections.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : (
        <DashboardGrid 
          sections={sections} 
          onAddSection={handleAddSection}
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection}
          timeInterval={timeInterval}
          dateRange={dateRange}
        />
      )}
      
      {/* Settings modal for new section */}
      {newSection && (
        <SectionSettings
          section={newSection}
          visible={isSettingsVisible}
          onClose={handleCancelNewSection}
          onSave={handleSaveNewSection}
        />
      )}
    </Content>
  );
};

export default Dashboard;