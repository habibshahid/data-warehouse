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

const SectionSettings = ({ section, visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const { availableMetadata } = useMetadata();
  const [visualizationType, setVisualizationType] = useState(section?.visualizationType || 'table');
  
  console.log("SectionSettings rendered with visible:", visible, "and section:", section);
  
  // Initialize form with section data when the modal becomes visible or section changes
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
      });
      
      setVisualizationType(section.visualizationType);
    }
  }, [visible, section, form]);
  
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
      };
      
      console.log("Updated section to save:", updatedSection);
      onSave(updatedSection);
    }).catch(error => {
      console.error("Form validation error:", error);
    });
  };
  
  // Handle visualization type change
  const handleVisualizationTypeChange = (value) => {
    setVisualizationType(value);
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
              >
                {availableMetadata.metrics.map(metric => (
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
        </>
      )
    }
  ];
  
  // Add chart options tab conditionally
  if (visualizationType === 'line' || visualizationType === 'bar') {
    items.push({
      key: 'chartOptions',
      label: 'Chart Options',
      children: (
        <>
          <Form.Item
            name={['chartOptions', 'showLegend']}
            valuePropName="checked"
          >
            <Checkbox>Show Legend</Checkbox>
          </Form.Item>
          
          <Form.Item
            name={['chartOptions', 'showDataLabels']}
            valuePropName="checked"
          >
            <Checkbox>Show Data Labels</Checkbox>
          </Form.Item>
          
          {visualizationType === 'bar' && (
            <Form.Item
              name={['chartOptions', 'horizontal']}
              valuePropName="checked"
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

  return (
    <Modal
      title="Section Settings"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      width={800}
      destroyOnClose={true}
      maskClosable={false}
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
        <Tabs items={items} defaultActiveKey="general" />
      </Form>
    </Modal>
  );
};

export default SectionSettings;