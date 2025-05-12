// src/components/sections/SectionSettings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tabs,
  Checkbox,
  Divider
} from 'antd';
import { useMetadata } from '../../hooks/useMetadata';

const { Option } = Select;
const { TabPane } = Tabs;

const SectionSettings = ({ section, visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const { availableMetadata } = useMetadata();
  const [visualizationType, setVisualizationType] = useState(section?.visualizationType || 'table');
  
  // Initialize form with section data
  useEffect(() => {
    if (visible && section) {
      form.setFieldsValue({
        title: section.title,
        visualizationType: section.visualizationType,
        columns: section.columns || [],
        filters: {
          queues: section.filters?.queues || [],
          channels: section.filters?.channels || [],
        },
        groupBy: section.groupBy,
      });
      
      setVisualizationType(section.visualizationType);
    }
  }, [visible, section, form]);
  
  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // Create updated section config
      const updatedSection = {
        ...section,
        title: values.title,
        visualizationType: values.visualizationType,
        columns: values.columns,
        filters: {
          queues: values.filters?.queues || [],
          channels: values.filters?.channels || [],
        },
        groupBy: values.groupBy,
      };
      
      onSave(updatedSection);
    });
  };
  
  // Handle visualization type change
  const handleVisualizationTypeChange = (value) => {
    setVisualizationType(value);
  };
  
  return (
    <Modal
      title="Section Settings"
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      width={800}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: section?.title || 'New Section',
          visualizationType: section?.visualizationType || 'table',
          columns: section?.columns || [],
          filters: {
            queues: section?.filters?.queues || [],
            channels: section?.filters?.channels || [],
          },
          groupBy: section?.groupBy,
        }}
      >
        <Tabs defaultActiveKey="general">
          <TabPane tab="General" key="general">
            <Form.Item
              name="title"
              label="Section Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter section title" />
            </Form.Item>
            
            <Form.Item
              name="visualizationType"
              label="Visualization Type"
              rules={[{ required: true, message: 'Please select a visualization type' }]}
            >
              <Select onChange={handleVisualizationTypeChange}>
                <Option value="table">Table</Option>
                <Option value="line">Line Chart</Option>
                <Option value="bar">Bar Chart</Option>
                <Option value="pie">Pie Chart</Option>
                <Option value="card">Metric Cards</Option>
              </Select>
            </Form.Item>
            
            {visualizationType !== 'card' && (
              <Form.Item
                name="columns"
                label="Columns/Metrics"
                rules={[{ required: true, message: 'Please select at least one column/metric' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select columns"
                  style={{ width: '100%' }}
                >
                  {availableMetadata.metrics.map(metric => (
                    <Option key={metric.value} value={metric.value}>
                      {metric.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </TabPane>
          
          <TabPane tab="Filters" key="filters">
            <Form.Item
              name={['filters', 'queues']}
              label="Filter by Queues"
            >
              <Select
                mode="multiple"
                placeholder="Select queues"
                style={{ width: '100%' }}
                allowClear
              >
                {availableMetadata.queues.map(queue => (
                  <Option key={queue.value} value={queue.value}>
                    {queue.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name={['filters', 'channels']}
              label="Filter by Channels"
            >
              <Select
                mode="multiple"
                placeholder="Select channels"
                style={{ width: '100%' }}
                allowClear
              >
                {availableMetadata.channels.map(channel => (
                  <Option key={channel.value} value={channel.value}>
                    {channel.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Divider />
            
            <Form.Item
              name="groupBy"
              label="Group By"
            >
              <Select placeholder="Select grouping" allowClear>
                <Option value="queue">Queue</Option>
                <Option value="channel">Channel</Option>
              </Select>
            </Form.Item>
          </TabPane>
          
          {(visualizationType === 'line' || visualizationType === 'bar') && (
            <TabPane tab="Chart Options" key="chartOptions">
              <Form.Item
                name="chartOptions.showLegend"
                valuePropName="checked"
              >
                <Checkbox>Show Legend</Checkbox>
              </Form.Item>
              
              <Form.Item
                name="chartOptions.showDataLabels"
                valuePropName="checked"
              >
                <Checkbox>Show Data Labels</Checkbox>
              </Form.Item>
              
              {visualizationType === 'bar' && (
                <Form.Item
                  name="chartOptions.horizontal"
                  valuePropName="checked"
                >
                  <Checkbox>Horizontal Bar Chart</Checkbox>
                </Form.Item>
              )}
              
              <Form.Item
                name="chartOptions.animate"
                valuePropName="checked"
                initialValue={true}
              >
                <Checkbox>Enable Animation</Checkbox>
              </Form.Item>
            </TabPane>
          )}
        </Tabs>
      </Form>
    </Modal>
  );
};

export default SectionSettings;