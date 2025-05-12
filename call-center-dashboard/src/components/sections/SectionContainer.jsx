import React, { useState } from 'react';
import { Card, Button, Modal, message, Tooltip } from 'antd';
import { 
  SettingOutlined,
  DeleteOutlined, 
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useDashboard } from '../../hooks/useDashboard';
import TableSection from './TableSection';
import ChartSection from './ChartSection';
import CardSection from './CardSection';
import SectionSettings from './SectionSettings';
import { formatDateTime } from '../../utils/dateUtils';

const { confirm } = Modal;

const SectionContainer = ({ section }) => {
  const { fetchSectionData, deleteSection, updateSection } = useDashboard();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log("Rendering SectionContainer for section:", section);
  
  // Refresh the section data
  const handleRefresh = async (e) => {
    if (e) e.stopPropagation();
    
    setIsLoading(true);
    try {
      await fetchSectionData(section.id);
      message.success('Section refreshed');
    } catch (error) {
      console.error('Error refreshing section:', error);
      message.error('Failed to refresh section');
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
        deleteSection(section.id);
      },
    });
  };
  
  // Show settings modal
  const handleShowSettings = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log("Opening settings for section:", section);
    setIsSettingsVisible(true);
  };
  
  // Hide settings modal
  const hideSettings = () => {
    setIsSettingsVisible(false);
  };
  
  // Save settings
  const saveSettings = (updatedSection) => {
    console.log("Saving updated section:", updatedSection);
    updateSection(updatedSection);
    setIsSettingsVisible(false);
    fetchSectionData(section.id);
  };
  
  // Render the appropriate section content based on visualization type
  const renderSectionContent = () => {
    if (!section.data && !isLoading) {
      return (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <p>No data available</p>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
          >
            Load Data
          </Button>
        </div>
      );
    }
    
    switch (section.visualizationType) {
      case 'table':
        return <TableSection section={section} loading={isLoading} />;
      case 'line':
      case 'bar':
      case 'pie':
        return <ChartSection section={section} loading={isLoading} />;
      case 'card':
        return <CardSection section={section} loading={isLoading} />;
      default:
        return <div>Unknown visualization type: {section.visualizationType}</div>;
    }
  };
  
  // Custom title with buttons, separate from the drag handle area
  const titleContent = (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '100%' 
    }}>
      <div>{section.title}</div>
      
      <div style={{ display: 'flex', gap: '4px' }}>
        <Tooltip title="Refresh">
          <Button 
            type="text" 
            size="small"
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
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
        section.lastUpdated && (
          <span style={{ 
            fontSize: 12, 
            color: '#999'
          }}>
            Updated: {formatDateTime(section.lastUpdated)}
          </span>
        )
      }
      bodyStyle={{ padding: section.visualizationType === 'card' ? 0 : 16, height: '100%' }}
      bordered={false}
      style={{ height: '100%' }}
    >
      {renderSectionContent()}
      
      {/* Render the settings modal */}
      <SectionSettings
        section={section}
        visible={isSettingsVisible}
        onClose={hideSettings}
        onSave={saveSettings}
      />
    </Card>
  );
};

export default SectionContainer;