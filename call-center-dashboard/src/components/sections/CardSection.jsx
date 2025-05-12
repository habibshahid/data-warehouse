// src/components/sections/CardSection.jsx
import React from 'react';
import { Row, Col, Statistic, Card, Spin } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  PhoneOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { formatNumber, formatPercentage, formatDuration } from '../../utils/formatters';

const CardSection = ({ section, loading }) => {
  // Helper function to determine icon for a metric
  const getIconForMetric = (metricName) => {
    const name = metricName.toLowerCase();
    
    if (name.includes('call') || name.includes('inbound') || name.includes('outbound')) {
      return <PhoneOutlined />;
    }
    if (name.includes('agent') || name.includes('user')) {
      return <UserOutlined />;
    }
    if (name.includes('time') || name.includes('duration') || name.includes('wait')) {
      return <ClockCircleOutlined />;
    }
    if (name.includes('answered') || name.includes('completed') || name.includes('success')) {
      return <CheckCircleOutlined />;
    }
    if (name.includes('abandoned') || name.includes('failed') || name.includes('error')) {
      return <CloseCircleOutlined />;
    }
    
    return null;
  };
  
  // Helper function to determine trend direction and value
  const getTrendData = (metricName, value) => {
    // In a real application, this would compare with historical data
    // For demonstration, we'll just use a random value
    const trending = Math.random() > 0.5 ? 'up' : 'down';
    const trendValue = Math.round(Math.random() * 15);
    
    const name = metricName.toLowerCase();
    const isNegativeMetric = name.includes('abandoned') || 
                             name.includes('failed') || 
                             name.includes('error') ||
                             name.includes('wait');
    
    // For negative metrics, down is good (green), up is bad (red)
    // For positive metrics, up is good (green), down is bad (red)
    const isPositiveTrend = (isNegativeMetric && trending === 'down') || 
                            (!isNegativeMetric && trending === 'up');
    
    return {
      icon: trending === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />,
      value: trendValue,
      color: isPositiveTrend ? '#3f8600' : '#cf1322',
    };
  };
  
  // Format value based on metric type
  const formatMetricValue = (metricName, value) => {
    const name = metricName.toLowerCase();
    
    if (name.includes('percentage') || name.includes('percent') || name.includes('rate')) {
      return formatPercentage(value);
    }
    if (name.includes('time') || name.includes('duration')) {
      return formatDuration(value);
    }
    
    return formatNumber(value);
  };
  
  // If there's no data, return empty state
  if (!section.data || section.data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p>No data available for cards</p>
      </div>
    );
  }
  
  // Extract metrics for cards
  const metrics = Object.entries(section.data[0])
    .filter(([key]) => !key.includes('id') && !key.includes('key') && !key.includes('date'))
    .slice(0, 8); // Limit to 8 cards
  
  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ padding: 16 }}>
        {metrics.map(([key, value]) => {
          const trend = getTrendData(key, value);
          
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={key}>
              <Card bordered={false} style={{ borderRadius: 8 }}>
                <Statistic
                  title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  value={formatMetricValue(key, value)}
                  prefix={getIconForMetric(key)}
                  suffix={
                    <span style={{ color: trend.color, fontSize: 14 }}>
                      {trend.icon} {trend.value}%
                    </span>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </Spin>
  );
};

export default CardSection;