// src/components/dashboard/DashboardSettings.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, Switch, Divider, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDashboard } from '../../hooks/useDashboard';
import { saveDashboard, loadDashboard } from '../../api/dashboardService';

const { Option } = Select;

const DashboardSettings = () => {
  const [form] = Form.useForm();
  const { 
    timeInterval,
    selectedColumns,
    dateRange,
    filters,
    setTimeInterval,
    setDateRange,
    setSelectedColumns,
    setFilters,
    refreshDashboard
  } = useDashboard();
  
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Show settings modal
  const showSettings = () => {
    setIsVisible(true);
    
    // Initialize form with current values
    form.setFieldsValue({
      defaultTimeInterval: timeInterval,
      autoRefresh: false,
      autoRefreshInterval: 5,
      saveFilterHistory: true,
    });
  };
  
  // Hide settings modal
  const hideSettings = () => {
    setIsVisible(false);
  };
  
  // Save dashboard settings
  const handleSaveSettings = async (values) => {
    try {
      setLoading(true);
      
      // Update dashboard context with new settings
      if (values.defaultTimeInterval !== timeInterval) {
        setTimeInterval(values.defaultTimeInterval);
      }
      
      // Save settings to localStorage or backend
      await saveDashboard({
        settings: values,
        state: {
          timeInterval,
          selectedColumns,
          dateRange,
          filters,
        },
      });
      
      message.success('Dashboard settings saved successfully');
      hideSettings();
      
      // Refresh dashboard with new settings
      refreshDashboard();
    } catch (error) {
      console.error('Error saving dashboard settings:', error);
      message.error('Failed to save dashboard settings');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Button onClick={showSettings}>
        Dashboard Settings
      </Button>
      
      <Modal
        title="Dashboard Settings"
        visible={isVisible}
        onCancel={hideSettings}
        footer={[
          <Button key="cancel" onClick={hideSettings} icon={<CloseOutlined />}>
            Cancel
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            onClick={() => form.submit()} 
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save Settings
          </Button>
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSettings}
          initialValues={{
            defaultTimeInterval: timeInterval,
            autoRefresh: false,
            autoRefreshInterval: 5,
            saveFilterHistory: true,
          }}
        >
          <Form.Item
            name="defaultTimeInterval"
            label="Default Time Interval"
          >
            <Select>
              <Option value="15min">15 Minutes</Option>
              <Option value="30min">30 Minutes</Option>
              <Option value="hourly">Hourly</Option>
              <Option value="daily">Daily</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
          </Form.Item>
          
          <Divider>Auto Refresh</Divider>
          
          <Form.Item
            name="autoRefresh"
            valuePropName="checked"
          >
            <Switch /> Enable Auto Refresh
          </Form.Item>
          
          <Form.Item
            name="autoRefreshInterval"
            label="Refresh Interval (minutes)"
            rules={[
              { 
                required: true, 
                message: 'Please enter a refresh interval' 
              },
              {
                type: 'number',
                min: 1,
                max: 60,
                message: 'Interval must be between 1 and 60 minutes',
                transform: value => Number(value),
              },
            ]}
          >
            <Input type="number" min={1} max={60} />
          </Form.Item>
          
          <Divider>Other Settings</Divider>
          
          <Form.Item
            name="saveFilterHistory"
            valuePropName="checked"
          >
            <Switch /> Save Filter History
          </Form.Item>
          
          <Form.Item
            name="showEmptySections"
            valuePropName="checked"
          >
            <Switch /> Show Empty Sections
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DashboardSettings;