// src/components/dashboard/EditSectionModal.jsx
import React, { useState, useEffect }       from 'react';
import { Modal, Form, Input, Select, Tabs } from 'antd';
import {
  TableOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  AppstoreOutlined
}                                           from '@ant-design/icons';
import useMetadata                          from '../../hooks/useMetadata';
// import { useMetadata } from '../../hooks/useMetadata';

const { Option } = Select;
const { TabPane } = Tabs;

const EditSectionModal = ({ visible, section, onCancel, onUpdate }) => {

  const [form] = Form.useForm();
  const [visualizationType, setVisualizationType] = useState('table');
  const [attributes, setAttributes] = useState([]);
  const { availableMetadata, isLoading } = useMetadata();

  // Set initial form values when section changes
  useEffect(() => {

    if (visible && section) {

      if (!isLoading) {
        console.log(availableMetadata)

        setAttributes(availableMetadata?.attributes[section.modelType])

        form.setFieldsValue({
          title: section.title,
          visualizationType: section.visualizationType || 'table',
          modelType: section.modelType,
          columns: section.columns || [],
          queues: section.filters?.queues || [],
          channels: section.filters?.channels || [],
          groupBy: section.groupBy,
          showLegend: section.chartOptions?.showLegend,
          showDataLabels: section.chartOptions?.showDataLabels,
          horizontal: section.chartOptions?.horizontal,
          animate: section.chartOptions?.animate
        });

        setVisualizationType(section.visualizationType || 'table');

      }

    }
  }, [visible, section, form, isLoading]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // Create the updated section object
      const updatedSection = {
        ...section,
        title: values.title,
        visualizationType: values.visualizationType,
        columns: values.columns || [],
        filters: {
          queues: values.queues || [],
          channels: values.channels || []
        },
        groupBy: values.groupBy,
        chartOptions: {
          showLegend: values.showLegend !== undefined ? values.showLegend : true,
          showDataLabels: values.showDataLabels !== undefined ? values.showDataLabels : false,
          horizontal: values.horizontal !== undefined ? values.horizontal : false,
          animate: values.animate !== undefined ? values.animate : true
        }
      };

      onUpdate(updatedSection);
    });
  };

  const handleVisTypeChange = (value) => {
    setVisualizationType(value);
  };

  return (
    <Modal
      title="Edit Section"
      visible={ visible }
      onCancel={ onCancel }
      onOk={ handleSubmit }
      width={ 800 }
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
                valuePropName="checked"
                label="Show Legend"
              >
                <Select>
                  <Option value={ true }>Yes</Option>
                  <Option value={ false }>No</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="showDataLabels"
                valuePropName="checked"
                label="Show Data Labels"
              >
                <Select>
                  <Option value={ true }>Yes</Option>
                  <Option value={ false }>No</Option>
                </Select>
              </Form.Item>

              { visualizationType === 'bar' && (
                <Form.Item
                  name="horizontal"
                  valuePropName="checked"
                  label="Horizontal Bar Chart"
                >
                  <Select>
                    <Option value={ true }>Yes</Option>
                    <Option value={ false }>No</Option>
                  </Select>
                </Form.Item>
              ) }

              <Form.Item
                name="animate"
                valuePropName="checked"
                label="Enable Animation"
              >
                <Select>
                  <Option value={ true }>Yes</Option>
                  <Option value={ false }>No</Option>
                </Select>
              </Form.Item>
            </TabPane>
          ) }
        </Tabs>
      </Form>
    </Modal>
  );
};

export default EditSectionModal;