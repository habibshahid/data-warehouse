import React, { useState, useEffect }               from 'react';
import { Modal,Drawer, Form, Input, Select, Tabs, Switch } from 'antd';
import {
  TableOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  AppstoreOutlined
}                                                   from '@ant-design/icons';
import { useMetadata }                              from '../../hooks/useMetadata';

const { Option } = Select;
const { TabPane } = Tabs;

const AddSectionModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [visualizationType, setVisualizationType] = useState('table');
  const [attributes, setAttributes] = useState([]);


  console.log(visible)

  const { availableMetadata } = useMetadata();

  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setVisualizationType('table');
    }
  }, [visible, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        console.log('Form values:', values);

        // Create the section object with properly formatted data
        const sectionData = {
          title: values.title,
          visualizationType: values.visualizationType,
          columns: values.columns || [],
          filters: {
            queues: values.queues || [],
            channels: values.channels || []
          },
          groupBy: values.groupBy,
          // Properly handle chartOptions
          chartOptions: {
            showLegend: values.showLegend === undefined ? true : values.showLegend,
            showDataLabels: values.showDataLabels === undefined ? false : values.showDataLabels,
            horizontal: values.horizontal === undefined ? false : values.horizontal,
            animate: values.animate === undefined ? true : values.animate
          },
          layout: { x: 0, y: 0, w: 12, h: 6 },
          modelType: values.modelType
        };

        console.log('Submitting section data:', sectionData);
        onAdd(sectionData);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleVisTypeChange = (value) => {
    setVisualizationType(value);

    // For pie charts, limit to one column if multiple are selected
    if (value === 'pie') {
      const currentColumns = form.getFieldValue('columns');
      if (Array.isArray(currentColumns) && currentColumns.length > 1) {
        form.setFieldsValue({ columns: [currentColumns[0]] });
      }
    }
  };

  return (
    <Drawer
      title="Add New Section"
      visible={ visible }
      onCancel={ onCancel }
      onOk={ handleSubmit }
      width={ 800 }
      destroyOnClose={ true }
    >
      <Form
        form={ form }
        layout="vertical"
        initialValues={ {
          visualizationType: 'table',
          showLegend: true,
          showDataLabels: false,
          horizontal: false,
          animate: true
        } }
      >
        <Form.Item
          name="title"
          label="Section Title"
          rules={ [{ required: true, message: 'Please enter a title' }] }
        >
          <Input placeholder="Enter section title"/>
        </Form.Item>

        <Form.Item
          name="modelType"
          label="Section Model Type"
          rules={ [{ required: true, message: 'Please select a model type' }] }
        >
          <Select allowClear onSelect={ (e) => {
            form.setFieldsValue({ columns: [] });
            setAttributes(availableMetadata?.attributes[e])
          } }>
            { availableMetadata?.models?.map(model => (
              <Option key={ model.value } value={ model.value }>
                { model.label }
              </Option>
            )) }
          </Select>
        </Form.Item>

        <Form.Item
          name="visualizationType"
          label="Visualization Type"
          rules={ [{ required: true, message: 'Please select a visualization type' }] }
        >
          <Select onChange={ handleVisTypeChange }>
            <Option value="table">
              <TableOutlined/> Table
            </Option>
            <Option value="line">
              <LineChartOutlined/> Line Chart
            </Option>
            <Option value="bar">
              <BarChartOutlined/> Bar Chart
            </Option>
            <Option value="pie">
              <PieChartOutlined/> Pie Chart
            </Option>
            <Option value="card">
              <AppstoreOutlined/> Metric Cards
            </Option>
          </Select>
        </Form.Item>

        <Tabs defaultActiveKey="data">
          <TabPane tab="Data" key="data">
            <Form.Item
              name="columns"
              label="Columns/Metrics"
              rules={ [{ required: true, message: 'Please select at least one column' }] }
            >
              <Select
                mode="multiple"
                placeholder="Select columns/metrics"
                style={ { width: '100%' } }
              >
                { Array.isArray(attributes) && attributes.map(metric => (
                  <Option key={ metric._id } value={ metric.value }>
                    { metric.label }
                  </Option>
                )) }
              </Select>
            </Form.Item>

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

          <TabPane tab="Filters" key="filters">
            <Form.Item
              name="queues"
              label="Filter by Queues"
            >
              <Select
                mode="multiple"
                placeholder="Select queues"
                style={ { width: '100%' } }
                allowClear
              >
                { availableMetadata.queues?.map(queue => (
                  <Option key={ queue.value } value={ queue.value }>
                    { queue.label }
                  </Option>
                )) }
              </Select>
            </Form.Item>

            <Form.Item
              name="channels"
              label="Filter by Channels"
            >
              <Select
                mode="multiple"
                placeholder="Select channels"
                style={ { width: '100%' } }
                allowClear
              >
                { availableMetadata.channels?.map(channel => (
                  <Option key={ channel.value } value={ channel.value }>
                    { channel.label }
                  </Option>
                )) }
              </Select>
            </Form.Item>
          </TabPane>

          { (visualizationType === 'line' || visualizationType === 'bar' || visualizationType === 'pie') && (
            <TabPane tab="Chart Options" key="chartOptions">
              <Form.Item
                name="showLegend"
                label="Show Legend"
                valuePropName="checked"
              >
                <Switch defaultChecked/>
              </Form.Item>

              <Form.Item
                name="showDataLabels"
                label="Show Data Labels"
                valuePropName="checked"
              >
                <Switch/>
              </Form.Item>

              { visualizationType === 'bar' && (
                <Form.Item
                  name="horizontal"
                  label="Horizontal Bar Chart"
                  valuePropName="checked"
                >
                  <Switch/>
                </Form.Item>
              ) }

              <Form.Item
                name="animate"
                label="Enable Animation"
                valuePropName="checked"
              >
                <Switch defaultChecked/>
              </Form.Item>
            </TabPane>
          ) }
        </Tabs>
      </Form>
    </Drawer>
  );
};

export default AddSectionModal;