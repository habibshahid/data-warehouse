// src/components/sections/SectionContainer.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, message, Tooltip } from 'antd';
import { 
  SettingOutlined,
  DeleteOutlined, 
  ReloadOutlined,
  ExclamationCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import TableSection from './TableSection';
import ChartSection from './ChartSection';
import CardSection from './CardSection';
import SectionSettings from './SectionSettings';
import { formatDateTime } from '../../utils/dateUtils';
import { fetchDashboardData } from '../../api/dashboardService';
import SectionAdvancedFilter from './SectionAdvancedFilter';

const { confirm } = Modal;

// Deep clone helper
const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error("Unable to deep clone object:", e);
    return { ...obj };
  }
};

const SectionContainer = ({ section, onUpdate, onDelete, timeInterval, dateRange, refreshTrigger }) => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionState, setSectionState] = useState(() => {
    // Initialize with a deep clone of the section
    const initialState = deepClone(section);
    console.log(`INIT SectionContainer ${section.id}, columns:`, initialState.columns);
    return initialState;
  });
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState(false);

  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log(`Section ${sectionState.id} received refresh trigger:`, refreshTrigger);
      fetchData();
    }
  }, [refreshTrigger]);

  // Update section state when critical prop changes (but preserve local state for others)
  useEffect(() => {
    setSectionState(prevState => ({
      ...prevState,
      id: section.id,
      title: section.title,
      layout: section.layout,
      // Only update data if it's changed to avoid unnecessary rerenders
      ...(section.data !== prevState.data ? { data: section.data } : {})
    }));
  }, [section.id, section.title, section.layout, section.data]);
  
  // Initial data load if section has no data yet
  useEffect(() => {
    if (!sectionState.data && !isLoading) {
      fetchData();
    }
  }, []);
  
  // DEBUG - Monitor columns state
  useEffect(() => {
    console.log(`SectionContainer ${sectionState.id} columns changed:`, sectionState.columns);
  }, [sectionState.columns]);
  
  const handleApplyAdvancedFilter = (advancedFilters) => {
    console.log('Advanced filters applied:', advancedFilters);
    
    // Update section with advanced filters
    const updatedSection = {
      ...sectionState,
      advancedFilters: advancedFilters
    };
    
    // Update local state
    setSectionState(updatedSection);
    
    // Notify parent about the update
    onUpdate(updatedSection);
    
    // Fetch data with the new filters
    fetchData();
  };

  // Fetch data directly - no dependence on external hooks or functions
  const handleSaveSettings = (updatedSection, refreshNeeded = false) => {
    console.log(`Settings saved for section ${sectionState.id}:`, updatedSection);
    console.log(`- Columns before:`, sectionState.columns);
    console.log(`- Columns after:`, updatedSection.columns);
    
    // Ensure columns is properly formatted for the visualization type
    let columns = updatedSection.columns || [];
    
    // No need to restrict card to a single column anymore
    // We've updated the CardSection component to handle multiple metrics
    
    // Create a complete updated section
    const newSection = {
      ...sectionState,
      title: updatedSection.title,
      visualizationType: updatedSection.visualizationType,
      columns: columns,
      filters: {
        queues: updatedSection.filters?.queues || [],
        channels: updatedSection.filters?.channels || [],
      },
      groupBy: updatedSection.groupBy,
      chartOptions: updatedSection.chartOptions
    };
    
    // Log the complete updated section for debugging
    console.log("Complete updated section:", newSection);
    
    // Update local state first
    setSectionState(newSection);
    
    // Notify parent of update
    onUpdate(newSection);
    
    // Close settings modal
    setIsSettingsVisible(false);
    
    if (refreshNeeded) {
      fetchData();
    } else {
      // Give the state time to update before fetching data
      setTimeout(() => {
        fetchData();
      }, 100);
    }
  };

  // Adjusted fetchData function in SectionContainer.jsx
  const fetchData = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Get the most current state of the section to ensure we have the latest filters
      const currentState = deepClone(sectionState);
      console.log(`Fetch data for section ${currentState.id} with current state:`, currentState);
      
      // Determine which date/time column to use based on time interval
      let dateColumn;
      switch (timeInterval) {
        case '15min':
        case '30min':
        case 'hourly':
        case 'daily':
          dateColumn = 'timeInterval';
          break;
        case 'monthly':
          dateColumn = 'pKey';
          break;
        case 'yearly':
          dateColumn = 'timeInterval';
          break;
        default:
          dateColumn = 'timeInterval';
      }
      
      // Create a copy of the columns and ensure dateColumn is included
      let columnsToUse = [...(currentState.columns || [])];
      
      // Always include the date column for all visualization types
      if (!columnsToUse.includes(dateColumn)) {
        columnsToUse.push(dateColumn);
      }
      
      // For table visualization, also add period and appropriate time fields
      if (currentState.visualizationType === 'table') {
        // First, always include period for tables
        if (!columnsToUse.includes('period')) {
          columnsToUse.push('period');
        }
        
        // Add appropriate time fields based on the time interval
        switch (timeInterval) {
          case '15min':
          case '30min':
          case 'hourly':
          case 'daily':
            // These tables have year, month, day
            ['year', 'month', 'day'].forEach(col => {
              if (!columnsToUse.includes(col)) {
                columnsToUse.push(col);
              }
            });
            break;
          case 'monthly':
            // Monthly tables have year and month
            ['year', 'month'].forEach(col => {
              if (!columnsToUse.includes(col)) {
                columnsToUse.push(col);
              }
            });
            break;
          case 'yearly':
            // Yearly tables only have year
            if (!columnsToUse.includes('year')) {
              columnsToUse.push('year');
            }
            break;
        }
      }
      
      // Critical fix: Make sure we're not losing filter state
      // Get the current filters from the section state
      const currentFilters = {
        queues: currentState.filters?.queues || [],
        channels: currentState.filters?.channels || []
      };
      
      // Log the filters we're about to use
      console.log(`Section ${currentState.id} using filters:`, currentFilters);
      
      // Include advanced filters if they exist
      const advancedFilters = currentState.advancedFilters || null;
      if (advancedFilters) {
        console.log(`Section ${currentState.id} using advanced filters:`, advancedFilters);
      }
      
      // Ensure we're using only this section's settings
      const params = {
        timeInterval,
        startDate: dateRange[0],
        endDate: dateRange[1],
        columns: columnsToUse, // Use modified columns that include date
        filters: currentFilters, // Use the current filters
        groupBy: currentState.groupBy,
        visualizationType: currentState.visualizationType,
        sectionId: currentState.id, // Include section ID for reference
        advancedFilters // Include advanced filters
      };
      
      console.log(`Fetching data for section ${currentState.id} with params:`, params);
      
      const response = await fetchDashboardData(params);
      
      // Ensure the data is in the expected format
      const processedData = Array.isArray(response) ? response.map((item, index) => ({
        ...item,
        key: index // Ensure each row has a unique key
      })) : [];
      
      console.log(`Received data for section ${currentState.id}:`, processedData);
      
      // Update section data in local state - but preserve existing filters and other settings
      setSectionState(prevState => ({
        ...prevState,
        data: processedData,
        lastUpdated: new Date().toISOString()
      }));
      
      // Also notify parent about the data update - but preserve existing settings
      const updatedSection = {
        ...currentState,
        data: processedData,
        lastUpdated: new Date().toISOString()
      };
      onUpdate(updatedSection);
      
    } catch (error) {
      console.error(`Error fetching data for section ${sectionState.id}:`, error);
      message.error('Failed to fetch section data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete the section after confirmation
  const handleDelete = (e) => {
    if (e) e.stopPropagation();
    
    confirm({
      title: 'Are you sure you want to delete this section?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        onDelete(sectionState.id);
      },
    });
  };
  
  // Show settings modal
  const handleShowSettings = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log(`Opening settings for section ${sectionState.id}`, sectionState);
    setIsSettingsVisible(true);
  };
  
  // Hide settings modal
  const hideSettings = () => {
    setIsSettingsVisible(false);
  };
  
  // Render the appropriate section content based on visualization type
  const renderSectionContent = () => {
    if (!sectionState.data && !isLoading) {
      return (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <p>No data available</p>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
          >
            Load Data
          </Button>
        </div>
      );
    }
    
    // Use the visualization type from section state
    const visualizationType = sectionState.visualizationType || 'table';
    
    switch (visualizationType) {
      case 'table':
        return <TableSection section={sectionState} loading={isLoading} />;
      case 'line':
      case 'bar':
      case 'pie':
        return <ChartSection section={sectionState} loading={isLoading} />;
      case 'card':
        return <CardSection section={sectionState} loading={isLoading} />;
      default:
        return <div>Unknown visualization type: {visualizationType}</div>;
    }
  };
  
  // Custom title with buttons
  const titleContent = (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '100%' 
    }}>
      <div>
        {sectionState.title || 'Untitled Section'} 
        {/* Show columns for debugging */}
        <span style={{ fontSize: '11px', color: '#999', marginLeft: '8px' }}>
          ({sectionState.visualizationType} - {sectionState.columns ? sectionState.columns.length : 0} cols)
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '4px' }}>
        <Tooltip title="Advanced Filters">
          <Button 
            type="text" 
            size="small"
            icon={<FilterOutlined />} 
            onClick={() => setIsAdvancedFilterVisible(true)}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </Tooltip>
        <Tooltip title="Refresh">
          <Button 
            type="text" 
            size="small"
            icon={<ReloadOutlined />} 
            onClick={fetchData}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </Tooltip>
        
        <Tooltip title="Settings">
          <Button 
            type="text" 
            size="small"
            icon={<SettingOutlined />} 
            onClick={handleShowSettings}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </Tooltip>
        
        <Tooltip title="Delete">
          <Button 
            type="text" 
            size="small"
            icon={<DeleteOutlined />} 
            onClick={handleDelete}
            danger
            onMouseDown={(e) => e.stopPropagation()}
          />
        </Tooltip>
      </div>
    </div>
  );
  
  return (
    <Card
      className="section-container"
      title={titleContent}
      loading={isLoading}
      extra={
        sectionState.lastUpdated && (
          <span style={{ 
            fontSize: 12, 
            color: '#999'
          }}>
            Updated: {formatDateTime(sectionState.lastUpdated)}
          </span>
        )
      }
      bodyStyle={{ 
        padding: sectionState.visualizationType === 'card' ? 0 : 16, 
        height: '100%',
        overflow: 'auto'
      }}
      bordered={false}
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column'
      }}
    >
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderSectionContent()}
      </div>
      
      {/* Settings modal */}
      <SectionSettings
        section={sectionState}
        visible={isSettingsVisible}
        onClose={hideSettings}
        onSave={handleSaveSettings}
      />
      {/* Advanced Filter modal */}
      <SectionAdvancedFilter
        section={sectionState}
        visible={isAdvancedFilterVisible}
        onClose={() => setIsAdvancedFilterVisible(false)}
        onApply={handleApplyAdvancedFilter}
        availableFields={
          sectionState.data && sectionState.data.length > 0 
            ? Object.keys(sectionState.data[0]).filter(k => k !== 'key')
            : []
        }
      />
    </Card>
    
  );
};

export default SectionContainer;