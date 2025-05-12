// src/components/sections/SectionContainer.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, message, Tooltip } from 'antd';
import { 
  SettingOutlined,
  DeleteOutlined, 
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import TableSection from './TableSection';
import ChartSection from './ChartSection';
import CardSection from './CardSection';
import SectionSettings from './SectionSettings';
import { formatDateTime } from '../../utils/dateUtils';
import { fetchDashboardData } from '../../api/dashboardService';

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

const SectionContainer = ({ section, onUpdate, onDelete, timeInterval, dateRange }) => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionState, setSectionState] = useState(() => {
    // Initialize with a deep clone of the section
    const initialState = deepClone(section);
    console.log(`INIT SectionContainer ${section.id}, columns:`, initialState.columns);
    return initialState;
  });
  
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
  
  // Fetch data directly - no dependence on external hooks or functions
  const handleSaveSettings = (updatedSection, refreshNeeded = false) => {
  console.log(`Settings saved for section ${sectionState.id}:`, updatedSection);
  console.log(`- Columns before:`, sectionState.columns);
  console.log(`- Columns after:`, updatedSection.columns);
  
  // Create a complete updated section
  const newSection = {
    ...sectionState,
    title: updatedSection.title,
    visualizationType: updatedSection.visualizationType,
    columns: updatedSection.columns || [], // Ensure we have a default empty array
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
    fetchData(section.id);
  }
  // Refresh data with new settings 
  // Give the state time to update before fetching data
  setTimeout(() => {
    fetchData();
  }, 100);
};

const fetchData = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Ensure we're using only this section's settings
      const params = {
        timeInterval,
        startDate: dateRange[0],
        endDate: dateRange[1],
        columns: sectionState.columns || [], // Use only this section's columns
        filters: {
          queues: sectionState.filters?.queues || [],
          channels: sectionState.filters?.channels || [],
        },
        groupBy: sectionState.groupBy,
        visualizationType: sectionState.visualizationType,
      };
      
      console.log(`Fetching data for section ${sectionState.id} with params:`, params);
      
      const response = await fetchDashboardData(params);
      
      // Update section data in local state
      setSectionState(prevState => ({
        ...prevState,
        data: response,
        lastUpdated: new Date().toISOString()
      }));
      
      // Also notify parent about the data update
      onUpdate({
        ...sectionState,
        data: response,
        lastUpdated: new Date().toISOString()
      });
      
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
    </Card>
  );
};

export default SectionContainer;