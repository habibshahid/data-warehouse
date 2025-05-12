import React, { useEffect, useRef, useState } from 'react';
import { Layout, Spin, Alert, Row, Col, Button } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import DashboardControls from './DashboardControls';
import DashboardGrid from './DashboardGrid';
import SectionSettings from '../sections/SectionSettings';
import { useDashboard } from '../../hooks/useDashboard';
import { useMetadata } from '../../hooks/useMetadata';

const { Content } = Layout;

const Dashboard = () => {
  const { 
    sections, 
    isLoading, 
    error, 
    refreshDashboard,
    createSection,
    updateSection,
    fetchSectionData
  } = useDashboard();
  
  // State for section settings modal
  const [newSectionId, setNewSectionId] = useState(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  
  // Use a ref to track if initial load has been done
  const initialLoadDone = useRef(false);
  
  // Load metadata (queues, channels, metrics)
  useMetadata();
  
  // Initial data load - only run once when sections change from 0 to >0
  useEffect(() => {
    // Only refresh if there are sections and we haven't already loaded
    if (sections.length > 0 && !initialLoadDone.current) {
      initialLoadDone.current = true;
      refreshDashboard();
    }
  }, [sections.length]); // Only depend on sections.length, not refreshDashboard
  
  // Handle adding a new section
  const handleAddSection = () => {
    const newSection = createSection({
      title: 'New Section',
      visualizationType: 'table',
    });
    
    // Save the ID to state to open settings for this section
    setNewSectionId(newSection.id);
    setIsSettingsVisible(true);
  };
  
  // Hide settings modal
  const hideSettings = () => {
    setIsSettingsVisible(false);
    setNewSectionId(null);
  };
  
  // Save settings for the new section
  const saveSettings = (updatedSection) => {
    console.log("Saving new section settings:", updatedSection);
    updateSection(updatedSection);
    setIsSettingsVisible(false);
    setNewSectionId(null);
    
    // Fetch data for the section with new settings
    fetchSectionData(updatedSection.id);
  };
  
  // Find the new section if settings are open
  const newSection = newSectionId ? sections.find(s => s.id === newSectionId) : null;
  
  return (
    <Content style={{ padding: '0 16px', marginTop: 16 }}>
      <DashboardControls />
      
      <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ marginRight: 8 }}
            onClick={handleAddSection}
          >
            Add Section
          </Button>
          <Button 
            onClick={refreshDashboard} 
            icon={<ReloadOutlined />}
            loading={isLoading}
          >
            Refresh
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
        />
      )}
      
      {isLoading && sections.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : (
        <DashboardGrid sections={sections} />
      )}
      
      {!isLoading && sections.length === 0 && (
        <div style={{ 
          padding: 48, 
          textAlign: 'center',
          background: '#f9f9f9',
          borderRadius: 4,
          marginBottom: 24
        }}>
          <h3>No dashboard sections yet</h3>
          <p>Add a section to get started tracking your call center metrics</p>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddSection}
          >
            Add Section
          </Button>
        </div>
      )}
      
      {/* Settings modal for the new section */}
      {newSection && (
        <SectionSettings
          section={newSection}
          visible={isSettingsVisible}
          onClose={hideSettings}
          onSave={saveSettings}
        />
      )}
    </Content>
  );
};

export default Dashboard;