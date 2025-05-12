// src/components/sections/CardSection.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Statistic, Card, Spin, Empty } from 'antd';
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
import MetricCard from '../visualizations/MetricCard';

const CardSection = ({ section, loading }) => {
  // Helper function to determine icon for a metric
  const getIconForMetric = (metricName) => {
    if (!metricName) return null;
    
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
    if (!metricName) return null;
    
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
      trend: trending,
      value: trendValue,
      color: isPositiveTrend ? '#3f8600' : '#cf1322',
    };
  };
  
  // Format value based on metric type
  const formatMetricValue = (metricName, value) => {
    if (!metricName) return null;
    
    const name = metricName.toLowerCase();
    
    if (name.includes('percentage') || name.includes('percent') || name.includes('rate')) {
      return { value: formatPercentage(value), format: 'percentage' };
    }
    if (name.includes('time') || name.includes('duration')) {
      return { value: formatDuration(value), format: 'duration' };
    }
    
    return { value: formatNumber(value), format: 'number' };
  };
  
  // If there's no data, return empty state
  if (!section.data || section.data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Empty description="No data available for cards" />
      </div>
    );
  }
  
  // If no columns selected, prompt the user
  if (!section.columns || section.columns.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Empty description="Please select metrics in section settings" />
      </div>
    );
  }
  
  // Calculate aggregate value for a metric
  const calculateAggregateValue = (metric) => {
    if (!metric || !section.data || section.data.length === 0) {
      return null;
    }
    
    // Get all values for the metric
    const values = section.data
      .map(item => item[metric])
      .filter(val => val !== undefined && val !== null)
      .map(val => typeof val === 'string' ? parseFloat(val) || 0 : val);
    
    // If no valid values, return null
    if (values.length === 0) {
      return null;
    }
    
    // Determine if the metric should be summed or averaged
    const metricName = metric.toLowerCase();
    const shouldSum = !metricName.includes('avg') && 
                      !metricName.includes('average') && 
                      !metricName.includes('percentage') && 
                      !metricName.includes('rate');
    
    // Calculate the aggregate value
    if (shouldSum) {
      return values.reduce((sum, val) => sum + val, 0);
    } else {
      const sum = values.reduce((sum, val) => sum + val, 0);
      return sum / values.length;
    }
  };
  
  // Build the grid based on the number of metrics
  const getGridSize = (count) => {
    if (count === 1) return 24;
    if (count === 2) return 12;
    if (count === 3) return 8;
    if (count === 4) return 6;
    return 6; // Default for 4+ metrics
  };
  
  // Display the cards
  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ padding: 16 }}>
        {section.columns.map(metric => {
          const aggregateValue = calculateAggregateValue(metric);
          const formattedValue = formatMetricValue(metric, aggregateValue);
          const trendData = getTrendData(metric, aggregateValue);
          const colSize = getGridSize(section.columns.length);
          
          return (
            <Col xs={24} sm={colSize === 6 ? 12 : colSize} md={colSize} key={metric}>
              <MetricCard
                title={metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={aggregateValue}
                icon={getIconForMetric(metric)}
                trend={trendData?.trend}
                trendValue={trendData?.value}
                format={formattedValue?.format || 'number'}
                loading={loading}
              />
            </Col>
          );
        })}
      </Row>
    </Spin>
  );
};

export default CardSection;