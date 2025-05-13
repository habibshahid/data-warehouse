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
  Tag
} from 'antd';
import { 
  FilterOutlined, 
  SearchOutlined, 
  ReloadOutlined, 
  ClearOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatDate } from '../../utils/dateUtils';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DashboardControls = ({ 
  timeInterval, 
  dateRange, 
  onTimeIntervalChange, 
  onDateRangeChange, 
  onApplyFilters 
}) => {
  const [form] = Form.useForm();
  
  // Handle form submission
  const handleSubmit = (values) => {
    // Update time interval
    if (values.timeInterval && values.timeInterval !== timeInterval) {
      onTimeIntervalChange(values.timeInterval);
    }
    
    // Update date range
    if (values.dateRange && values.dateRange.length === 2) {
      const newRange = [
        values.dateRange[0].startOf('day').toDate(),
        values.dateRange[1].endOf('day').toDate(),
      ];
      onDateRangeChange(newRange);
    }
    
    // Apply filters to refresh the dashboard
    onApplyFilters(); // This will trigger the refresh
  };
  
  // Reset the form
  const handleReset = () => {
    form.resetFields();
    
    onTimeIntervalChange('daily');
    onDateRangeChange([null, null]);
    
    onApplyFilters();
  };
  
  // Initialize form with current values
  useEffect(() => {
    form.setFieldsValue({
      timeInterval,
      dateRange: dateRange[0] && dateRange[1] ? [
        dayjs(dateRange[0]),
        dayjs(dateRange[1])
      ] : null
    });
  }, [form, timeInterval, dateRange]);
  
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
          ] : null
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Form.Item
              name="timeInterval"
              label="Time Interval"
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
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <Form.Item
              name="dateRange"
              label="Date Range"
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={24} md={8} lg={8}>
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
                onClick={onApplyFilters}
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