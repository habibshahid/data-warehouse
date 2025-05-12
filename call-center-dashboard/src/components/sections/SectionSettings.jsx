import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tabs,
  Checkbox,
  Divider,
  Button,
  message
} from 'antd';
import { useMetadata } from '../../hooks/useMetadata';

const { Option } = Select;

// Deep clone helper
const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error("Unable to deep clone object:", e);
    return { ...obj };
  }
};

const SectionSettings = ({ section, visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const { availableMetadata } = useMetadata();
  const [visualizationType, setVisualizationType] = useState('table');
  const [selectedColumns, setSelectedColumns] = useState([]);
  
  console.log("SectionSettings rendered with visible:", visible);
  console.log("Section data:", section);
  
  // Initialize form with section data when the modal becomes visible
  useEffect(() => {
    if (visible && section) {
      console.log("Setting form values with section:", section);
      form.setFieldsValue({
        title: section.title,
        visualizationType: section.visualizationType,
        columns: section.columns || [],
        filters: {
          queues: section.filters?.queues || [],
          channels: section.filters?.channels || [],
        },
        groupBy: section.groupBy,
        // Also set chart options if available
        chartOptions: section.chartOptions || {
          showLegend: true,
          showDataLabels: false,
          horizontal: false,
          animate: true,
        },
      });
      
      setVisualizationType(section.visualizationType);
    }
  }, [visible, section, form]);
  
  // Log column changes
  useEffect(() => {
    console.log("Selected columns changed:", selectedColumns);
  }, [selectedColumns]);
  
  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log("Form values on save:", values);
      
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
        chartOptions: values.chartOptions,
      };
      
      console.log("Updated section to save:", updatedSection);
      
      // Save the section
      onSave(updatedSection);
      
      // Explicitly signal that we need to refresh data
      // You might need to pass this as a second parameter if it doesn't exist
      onSave(updatedSection, true); // The true flag indicates we need a data refresh
    }).catch(error => {
      console.error("Form validation error:", error);
    });
  };
  
  // Handle visualization type change
  const handleVisualizationTypeChange = (value) => {
    console.log("Visualization type changed to:", value);
    setVisualizationType(value);
  };
  
  // Handle column selection change
  const handleColumnChange = (value) => {
    console.log("Column selection changed to:", value);
    setSelectedColumns(value);
  };
  
  const items = [
    {
      key: 'general',
      label: 'General',
      children: (
        <>
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
                onChange={handleColumnChange}
              >
                {availableMetadata.metrics?.map(metric => (
                  <Option key={metric.value} value={metric.value}>
                    {metric.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </>
      )
    },
    {
      key: 'filters',
      label: 'Filters',
      children: (
        <>
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
              {availableMetadata.queues?.map(queue => (
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
              {availableMetadata.channels?.map(channel => (
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
        </>
      )
    }
  ];
  
  // Add chart options tab conditionally
  if (visualizationType === 'line' || visualizationType === 'bar' || visualizationType === 'pie') {
    items.push({
      key: 'chartOptions',
      label: 'Chart Options',
      children: (
        <>
          <Form.Item
            name={['chartOptions', 'showLegend']}
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Show Legend</Checkbox>
          </Form.Item>
          
          <Form.Item
            name={['chartOptions', 'showDataLabels']}
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Show Data Labels</Checkbox>
          </Form.Item>
          
          {visualizationType === 'bar' && (
            <Form.Item
              name={['chartOptions', 'horizontal']}
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Horizontal Bar Chart</Checkbox>
            </Form.Item>
          )}
          
          <Form.Item
            name={['chartOptions', 'animate']}
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Enable Animation</Checkbox>
          </Form.Item>
        </>
      )
    });
  }

  // Add debug panel to check values
  items.push({
    key: 'debug',
    label: 'Debug',
    children: (
      <>
        <div>
          <h4>Current Section Columns:</h4>
          <pre>{JSON.stringify(section.columns || [], null, 2)}</pre>
          
          <h4>Current Form Columns:</h4>
          <pre>{JSON.stringify(form.getFieldValue('columns') || [], null, 2)}</pre>
          
          <h4>Selected Columns State:</h4>
          <pre>{JSON.stringify(selectedColumns, null, 2)}</pre>
          
          <Divider />
          
          <Button 
            onClick={() => {
              console.log("Current form values:", form.getFieldsValue(true));
            }}
          >
            Log Form Values
          </Button>
        </div>
      </>
    )
  });

  return (
    <Modal
      title="Section Settings"
      open={visible}
      onCancel={onClose}
      okText="Save"
      onOk={handleSubmit}
      width={800}
      destroyOnClose={false} 
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={true}
        initialValues={{
          title: section?.title || 'New Section',
          visualizationType: section?.visualizationType || 'table',
          columns: section?.columns || [],
          filters: {
            queues: section?.filters?.queues || [],
            channels: section?.filters?.channels || [],
          },
          groupBy: section?.groupBy || null,
          chartOptions: section?.chartOptions || {
            showLegend: true,
            showDataLabels: false,
            horizontal: false,
            animate: true,
          }
        }}
      >
        <Tabs items={items} defaultActiveKey="general" />
      </Form>
    </Modal>
  );
};

export default SectionSettings;