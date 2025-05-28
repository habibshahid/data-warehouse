import moment                                                                    from 'moment';
import React, { useState, useEffect }                                            from 'react';
import { Modal, Drawer, Form, Input, Select, Tabs, Switch, message, DatePicker } from 'antd';
import {
  TableOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  AppstoreOutlined
}                                                                                from '@ant-design/icons';
import { useMetadata }                                                           from '../../hooks/useMetadata';

const { Option } = Select;
const { TabPane } = Tabs;

const AddSectionModal = ({ visible, onCancel, onAdd }) => {

  const [form] = Form.useForm();
  const [visualizationType, setVisualizationType] = useState('table');
  const [attributes, setAttributes] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState(null);

  const { availableMetadata } = useMetadata();

  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setVisualizationType('table');
      setSelectedInterval(null);
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
            channels: values.channels || [],
            agents: values.agents || [],
            dateRange: values.dateRange
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
          modelType: values.modelType,
          selectedInterval: values.intervalType
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

  const { RangePicker } = DatePicker

  const intervalTypes = [
    { label: '15 Min', value: '15min' },
    { label: 'Half Hour', value: 'halfHour' },
    { label: 'Full Hour', value: 'hourly' },
    { label: 'Daily', value: 'daily' },
    { label: 'Monthly', value: 'month' },
    { label: 'Yearly', value: 'year' }
  ]

  // Get format based on selected interval
  const getDateFormat = () => {
    if (!selectedInterval) return "YYYY-MM-DD";

    if (['15min', 'halfHour', 'hourly'].includes(selectedInterval)) {
      return "YYYY-MM-DD HH:00:00";
    }
    else if (selectedInterval === 'daily') {
      return 'YYYY-MM-DD';
    }
    else if (selectedInterval === 'month') {
      return 'YYYY-MM';
    }
    else if (selectedInterval === 'year') {
      return 'YYYY';
    }
    return "YYYY-MM-DD";
  };

  // Get picker type based on selected interval
  const getPickerType = () => {
    if (!selectedInterval) return undefined;

    if (['15min', 'halfHour', 'hourly', 'daily'].includes(selectedInterval)) {
      return undefined;
    }
    else if (selectedInterval === 'month') {
      return 'month';
    }
    else if (selectedInterval === 'year') {
      return 'year';
    }
    return undefined;
  };

  // Get showTime configuration
  const getShowTimeConfig = () => {
    if (!selectedInterval) return false;

    if (['15min', 'halfHour', 'hourly'].includes(selectedInterval)) {
      return {
        format: 'HH'
      };
    }
    return false;
  };

  const handleIntervalChange = (value) => {

    console.log(value, "ddddddddddddddddd")

    setSelectedInterval(value);
    // Reset date range when interval changes
    form.setFieldsValue({
      dateRange: null
    });
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates[1] && moment(dates[1]).toDate() > new Date()) {
      message.warning('End time cannot be greater than current time');

      // Set end date to current time if it exceeds current time
      const correctedEndDate = moment().isBefore(dates[1]) ? moment() : dates[1];
      form.setFieldsValue({
        dateRange: [dates[0], correctedEndDate]
      });
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
          label="Title"
          rules={ [
            { required: true, message: 'Please enter a title' },
            { max: 50, message: 'Only 50 characters allowed' }
          ] }
        >
          <Input placeholder="Enter section title"/>
        </Form.Item>

        <Form.Item
          name="modelType"
          label="Model Type"
          rules={ [{ required: true, message: 'Please select a model type' }] }
        >
          <Select allowClear onSelect={ (e) => {
            form.setFieldsValue({ columns: [] });
            setAttributes(availableMetadata?.attributes[e])
          } }>
            { [{ value: 'agentJournal', label: "Agent Journal" }].map(model => (
              <Option key={ model.value } value={ model.value }>
                { model.label }
              </Option>
            )) }
          </Select>
        </Form.Item>

        <Form.Item
          name="intervalType"
          label="Interval Type"
          rules={ [{ required: true, message: 'Please select a Interval Type' }] }
        >
          <Select
            allowClear
            onChange={ handleIntervalChange }
          >
            { intervalTypes.map(model => (
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
          <Select disabled onChange={ handleVisTypeChange }>
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
          name="dateRange"
          label="Date Range"
          rules={ [{ required: true, message: 'Please select a date range' }] }
        >
          <RangePicker
            style={ { width: '100%' } }
            format={ getDateFormat() }
            picker={ getPickerType() }
            showTime={ getShowTimeConfig() }
            onChange={ handleDateRangeChange }
            placeholder={
              !selectedInterval
                ? ['Select interval first', 'Select interval first']
                : ['Start date', 'End date']
            }
          />
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
              <Select labelInValue mode="multiple" placeholder="Select grouping" allowClear>
                <Option value="agent">Agent</Option>
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

            <Form.Item
              name="agents"
              label="Filter by Agents"
            >
              <Select
                mode="multiple"
                placeholder="Select Agents"
                style={ { width: '100%' } }
                allowClear
              >
                { availableMetadata.agents?.map(agent => (
                  <Option key={ agent?.username } value={ agent?.username }>
                    { agent?.sip_interface }
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