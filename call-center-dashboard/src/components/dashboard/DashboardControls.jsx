// src/components/dashboard/DashboardControls.jsx
import React, { useEffect } from 'react';
import { 
  Card, 
  Form, 
  Select, 
  DatePicker, 
  Button, 
  Row, 
  Col,
  Divider,
  Space,
  Tag,
  Tooltip
} from 'antd';
import { 
  FilterOutlined, 
  SearchOutlined, 
  ReloadOutlined, 
  ClearOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useDashboard } from '../../hooks/useDashboard';
import { useMetadata } from '../../hooks/useMetadata';
import dayjs from 'dayjs';
import { formatDate } from '../../utils/dateUtils';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DashboardControls = () => {
  const { 
    timeInterval, 
    dateRange, 
    selectedColumns,
    filters, 
    groupBy,
    availableMetadata,
    setTimeInterval,
    setDateRange,
    setSelectedColumns,
    setFilters,
    setGroupBy,
    refreshDashboard
  } = useDashboard();
  
  // Load metadata
  useMetadata();
  
  const [form] = Form.useForm();
  
  // Handle form submission
  const handleSubmit = (values) => {
    // Update time interval
    if (values.timeInterval) {
      setTimeInterval(values.timeInterval);
    }
    
    // Update date range
    if (values.dateRange && values.dateRange.length === 2) {
      setDateRange([
        values.dateRange[0].startOf('day').toDate(),
        values.dateRange[1].endOf('day').toDate(),
      ]);
    }
    
    // Update columns
    if (values.columns) {
      setSelectedColumns(values.columns);
    }
    
    // Update filters
    const newFilters = {};
    if (values.queues) {
      newFilters.queues = values.queues;
    }
    if (values.channels) {
      newFilters.channels = values.channels;
    }
    setFilters(newFilters);
    
    // Update group by
    if (values.groupBy) {
      setGroupBy(values.groupBy);
    } else {
      setGroupBy(null);
    }
    
    // Refresh dashboard with new parameters
    refreshDashboard();
  };
  
  // Reset the form
  const handleReset = () => {
    form.resetFields();
    
    setTimeInterval('daily');
    setDateRange([null, null]);
    setSelectedColumns([]);
    setFilters({
      queues: [],
      channels: [],
    });
    setGroupBy(null);
    
    refreshDashboard();
  };
  
  // Initialize form with current values
  useEffect(() => {
    form.setFieldsValue({
      timeInterval,
      dateRange: dateRange[0] && dateRange[1] ? [
        dayjs(dateRange[0]),
        dayjs(dateRange[1])
      ] : null,
      columns: selectedColumns,
      queues: filters.queues || [],
      channels: filters.channels || [],
      groupBy,
    });
  }, [form, timeInterval, dateRange, selectedColumns, filters, groupBy]);
  
  // Convert filters to display tags
  const renderFilterTags = () => {
    const tags = [];
    
    if (timeInterval) {
      tags.push(
        <Tag color="blue" key="interval">
          Interval: {timeInterval}
        </Tag>
      );
    }
    
    if (dateRange[0] && dateRange[1]) {
      tags.push(
        <Tag color="blue" key="dateRange">
          Date: {formatDate(dateRange[0])} to {formatDate(dateRange[1])}
        </Tag>
      );
    }
    
    if (selectedColumns && selectedColumns.length > 0) {
      tags.push(
        <Tag color="blue" key="columns">
          Columns: {selectedColumns.length}
        </Tag>
      );
    }
    
    if (filters.queues && filters.queues.length > 0) {
      tags.push(
        <Tag color="blue" key="queues">
          Queues: {filters.queues.length}
        </Tag>
      );
    }
    
    if (filters.channels && filters.channels.length > 0) {
      tags.push(
        <Tag color="blue" key="channels">
          Channels: {filters.channels.length}
        </Tag>
      );
    }
    
    if (groupBy) {
      tags.push(
        <Tag color="blue" key="groupBy">
          Group by: {groupBy}
        </Tag>
      );
    }
    
    return tags;
  };
  
  return (
    <Card className="dashboard-card">
      <Form
        form={form}
        name="dashboardControls"
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          timeInterval,
          dateRange: dateRange[0] && dateRange[1] ? [
            dayjs(dateRange[0]),
            dayjs(dateRange[1])
          ] : null,
          columns: selectedColumns,
          queues: filters.queues || [],
          channels: filters.channels || [],
          groupBy,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="timeInterval"
              label={
                <span>
                  Time Interval 
                  <Tooltip title="Select the time granularity for the data">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
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
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="dateRange"
              label="Date Range"
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="columns"
              label="Columns"
            >
              <Select
                mode="multiple"
                placeholder="Select columns"
                allowClear
                style={{ width: '100%' }}
                maxTagCount={3}
              >
                {availableMetadata.metrics.map(metric => (
                  <Option key={metric.value} value={metric.value}>
                    {metric.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="groupBy"
              label="Group By"
            >
              <Select allowClear placeholder="Select grouping">
                <Option value="queue">Queue</Option>
                <Option value="channel">Channel</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="queues"
              label="Queues"
            >
              <Select
                mode="multiple"
                placeholder="Select queues"
                allowClear
                style={{ width: '100%' }}
                maxTagCount={3}
              >
                {availableMetadata.queues.map(queue => (
                  <Option key={queue.value} value={queue.value}>
                    {queue.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="channels"
              label="Channels"
            >
              <Select
                mode="multiple"
                placeholder="Select channels"
                allowClear
                style={{ width: '100%' }}
                maxTagCount={3}
              >
                {availableMetadata.channels.map(channel => (
                  <Option key={channel.value} value={channel.value}>
                    {channel.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={24} md={12}>
            <Form.Item style={{ marginTop: 29 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
                style={{ marginRight: 8 }}
              >
                Apply Filters
              </Button>
              <Button 
                onClick={handleReset}
                icon={<ClearOutlined />}
                style={{ marginRight: 8 }}
              >
                Reset
              </Button>
              <Button 
                onClick={refreshDashboard}
                icon={<ReloadOutlined />}
              >
                Refresh
              </Button>
            </Form.Item>
          </Col>
        </Row>
        
        {renderFilterTags().length > 0 && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Space size={[0, 8]} wrap>
                <FilterOutlined style={{ marginRight: 8 }} />
                {renderFilterTags()}
                <Button 
                  type="text" 
                  size="small" 
                  icon={<ClearOutlined />}
                  onClick={handleReset}
                >
                  Clear All
                </Button>
              </Space>
            </div>
          </>
        )}
      </Form>
    </Card>
  );
};

export default DashboardControls;