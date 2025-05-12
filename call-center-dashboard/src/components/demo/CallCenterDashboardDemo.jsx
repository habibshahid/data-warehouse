import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Button, Row, Col, Statistic, Table, Tabs, Space, Typography, Divider } from 'antd';
import { 
  PhoneOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  SyncOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BarChartOutlined,
  TableOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data for our dashboard demo
const generateMockData = () => {
  const channels = ['Phone', 'Chat', 'Email', 'Social'];
  const queues = ['Sales', 'Support', 'Technical', 'Billing', 'General'];
  
  // Generate random stats for each channel and queue
  const data = [];
  
  for (const channel of channels) {
    for (const queue of queues) {
      // Only include some combinations to make the data more realistic
      if (Math.random() > 0.3) {
        const inbound = Math.floor(Math.random() * 500) + 50;
        const answered = Math.floor(inbound * (0.7 + Math.random() * 0.25));
        const abandoned = inbound - answered;
        const avgWaitTime = Math.floor(Math.random() * 180) + 10;
        const avgHandleTime = Math.floor(Math.random() * 600) + 120;
        
        data.push({
          channel,
          queue,
          inbound,
          answered,
          abandoned,
          abandonedPercentage: (abandoned / inbound) * 100,
          avgWaitTime,
          avgHandleTime,
          serviceLevel: (Math.random() * 30) + 70, // 70-100%
          firstResponseTimeAvg: Math.floor(Math.random() * 120) + 5,
          completeByAgent: Math.floor(answered * (0.3 + Math.random() * 0.5)),
          completeByCaller: Math.floor(answered * (0.1 + Math.random() * 0.3)),
        });
      }
    }
  }
  
  return data;
};

// Format time in seconds to mm:ss
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Demo component for the Call Center Dashboard
const CallCenterDashboard = () => {
  const [timeInterval, setTimeInterval] = useState('daily');
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedQueues, setSelectedQueues] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [groupBy, setGroupBy] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);
  
  // Refresh data based on filters
  const refreshData = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 1000);
  };
  
  // Apply filters
  const applyFilters = () => {
    refreshData();
  };
  
  // Reset filters
  const resetFilters = () => {
    setTimeInterval('daily');
    setDateRange([null, null]);
    setSelectedQueues([]);
    setSelectedChannels([]);
    setGroupBy(null);
    refreshData();
  };
  
  // Filter data based on selections
  const filteredData = data.filter(item => {
    if (selectedQueues.length > 0 && !selectedQueues.includes(item.queue)) {
      return false;
    }
    if (selectedChannels.length > 0 && !selectedChannels.includes(item.channel)) {
      return false;
    }
    return true;
  });
  
  // Calculate summary metrics
  const totalInbound = filteredData.reduce((sum, item) => sum + item.inbound, 0);
  const totalAnswered = filteredData.reduce((sum, item) => sum + item.answered, 0);
  const totalAbandoned = filteredData.reduce((sum, item) => sum + item.abandoned, 0);
  const avgServiceLevel = filteredData.reduce((sum, item) => sum + item.serviceLevel, 0) / (filteredData.length || 1);
  const avgWaitTime = filteredData.reduce((sum, item) => sum + item.avgWaitTime, 0) / (filteredData.length || 1);
  const avgHandleTime = filteredData.reduce((sum, item) => sum + item.avgHandleTime, 0) / (filteredData.length || 1);
  
  // Table columns
  const columns = [
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
    },
    {
      title: 'Queue',
      dataIndex: 'queue',
      key: 'queue',
    },
    {
      title: 'Inbound',
      dataIndex: 'inbound',
      key: 'inbound',
      sorter: (a, b) => a.inbound - b.inbound,
    },
    {
      title: 'Answered',
      dataIndex: 'answered',
      key: 'answered',
      sorter: (a, b) => a.answered - b.answered,
    },
    {
      title: 'Abandoned',
      dataIndex: 'abandoned',
      key: 'abandoned',
      sorter: (a, b) => a.abandoned - b.abandoned,
    },
    {
      title: 'Abandoned %',
      dataIndex: 'abandonedPercentage',
      key: 'abandonedPercentage',
      render: value => `${value.toFixed(2)}%`,
      sorter: (a, b) => a.abandonedPercentage - b.abandonedPercentage,
    },
    {
      title: 'Avg Wait Time',
      dataIndex: 'avgWaitTime',
      key: 'avgWaitTime',
      render: value => formatTime(value),
      sorter: (a, b) => a.avgWaitTime - b.avgWaitTime,
    },
    {
      title: 'Avg Handle Time',
      dataIndex: 'avgHandleTime',
      key: 'avgHandleTime',
      render: value => formatTime(value),
      sorter: (a, b) => a.avgHandleTime - b.avgHandleTime,
    },
    {
      title: 'Service Level',
      dataIndex: 'serviceLevel',
      key: 'serviceLevel',
      render: value => `${value.toFixed(2)}%`,
      sorter: (a, b) => a.serviceLevel - b.serviceLevel,
    },
  ];
  
  return (
    <div>
      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Time Interval</label>
              <Select
                value={timeInterval}
                onChange={setTimeInterval}
                style={{ width: '100%' }}
              >
                <Option value="15min">15 Minutes</Option>
                <Option value="30min">30 Minutes</Option>
                <Option value="hourly">Hourly</Option>
                <Option value="daily">Daily</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Date Range</label>
              <RangePicker style={{ width: '100%' }} />
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Queues</label>
              <Select
                mode="multiple"
                placeholder="Select queues"
                value={selectedQueues}
                onChange={setSelectedQueues}
                style={{ width: '100%' }}
              >
                <Option value="Sales">Sales</Option>
                <Option value="Support">Support</Option>
                <Option value="Technical">Technical</Option>
                <Option value="Billing">Billing</Option>
                <Option value="General">General</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Channels</label>
              <Select
                mode="multiple"
                placeholder="Select channels"
                value={selectedChannels}
                onChange={setSelectedChannels}
                style={{ width: '100%' }}
              >
                <Option value="Phone">Phone</Option>
                <Option value="Chat">Chat</Option>
                <Option value="Email">Email</Option>
                <Option value="Social">Social</Option>
              </Select>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Group By</label>
              <Select
                placeholder="Select grouping"
                value={groupBy}
                onChange={setGroupBy}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="queue">Queue</Option>
                <Option value="channel">Channel</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={18}>
            <div style={{ marginTop: 29 }}>
              <Button 
                type="primary" 
                onClick={applyFilters} 
                style={{ marginRight: 8 }}
                loading={loading}
              >
                Apply Filters
              </Button>
              <Button onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* KPI Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Total Inbound"
              value={totalInbound}
              prefix={<PhoneOutlined />}
              suffix={
                <span style={{ color: '#3f8600', fontSize: 14 }}>
                  <ArrowUpOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Answered Calls"
              value={totalAnswered}
              prefix={<UserOutlined />}
              suffix={
                <span style={{ color: '#3f8600', fontSize: 14 }}>
                  <ArrowUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Abandoned Calls"
              value={totalAbandoned}
              prefix={<PhoneOutlined />}
              suffix={
                <span style={{ color: '#cf1322', fontSize: 14 }}>
                  <ArrowUpOutlined /> 5%
                </span>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Service Level"
              value={avgServiceLevel.toFixed(2)}
              suffix="%"
              prefix={<UserOutlined />}
              valueStyle={{ color: avgServiceLevel >= 80 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Avg Wait Time"
              value={formatTime(Math.round(avgWaitTime))}
              prefix={<ClockCircleOutlined />}
              suffix={
                <span style={{ color: '#cf1322', fontSize: 14 }}>
                  <ArrowUpOutlined /> 3%
                </span>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Avg Handle Time"
              value={formatTime(Math.round(avgHandleTime))}
              prefix={<ClockCircleOutlined />}
              suffix={
                <span style={{ color: '#3f8600', fontSize: 14 }}>
                  <ArrowDownOutlined /> 7%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>
      
      {/* Data Visualizations */}
      <Tabs defaultActiveKey="table">
        <TabPane 
          tab={<span><TableOutlined /> Table</span>} 
          key="table"
        >
          <Card>
            <Table
              columns={columns}
              dataSource={filteredData.map((item, index) => ({ ...item, key: index }))}
              loading={loading}
              pagination={{ pageSize: 10 }}
              size="small"
              bordered
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><LineChartOutlined /> Line Chart</span>} 
          key="line"
        >
          <Card>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <Title level={4}>Call Volume Trends</Title>
              <Divider />
              <Text type="secondary">This is a placeholder for a line chart visualization. In a real application, this would show call volume trends over time.</Text>
            </div>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><BarChartOutlined /> Bar Chart</span>} 
          key="bar"
        >
          <Card>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <Title level={4}>Queue Performance</Title>
              <Divider />
              <Text type="secondary">This is a placeholder for a bar chart visualization. In a real application, this would show queue performance metrics.</Text>
            </div>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><PieChartOutlined /> Pie Chart</span>} 
          key="pie"
        >
          <Card>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <Title level={4}>Call Distribution</Title>
              <Divider />
              <Text type="secondary">This is a placeholder for a pie chart visualization. In a real application, this would show call distribution across channels or queues.</Text>
            </div>
          </Card>
        </TabPane>
      </Tabs>
      
      {/* Last updated info */}
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Space>
          <Text type="secondary">Last updated: {new Date().toLocaleString()}</Text>
          <Button 
            icon={<SyncOutlined />} 
            onClick={refreshData}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default CallCenterDashboard;