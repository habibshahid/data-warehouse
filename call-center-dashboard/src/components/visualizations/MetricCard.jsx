import React from 'react';
import { Card, Statistic } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined 
} from '@ant-design/icons';
import { formatNumber, formatPercentage, formatDuration } from '../../utils/formatters';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  trendType = 'percentage', 
  format = 'number',
  prefix,
  suffix,
  loading = false
}) => {
  // Format the value based on the format type
  const formatValue = () => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    switch (format) {
      case 'percentage':
        return formatPercentage(value);
      case 'duration':
        return formatDuration(value);
      case 'time':
        return formatDuration(value, 'hh:mm:ss');
      case 'number':
      default:
        return formatNumber(value);
    }
  };
  
  // Determine trend icon and color
  const renderTrend = () => {
    if (trend === undefined || trendValue === undefined) {
      return null;
    }
    
    const isPositive = trend === 'up';
    const formattedTrendValue = trendType === 'percentage' 
      ? `${trendValue}%` 
      : formatNumber(trendValue);
    
    return (
      <span style={{ 
        color: isPositive ? '#3f8600' : '#cf1322',
        fontSize: 14,
        marginLeft: 8
      }}>
        {isPositive 
          ? <ArrowUpOutlined /> 
          : <ArrowDownOutlined />
        } {formattedTrendValue}
      </span>
    );
  };
  
  return (
    <Card bordered={false} loading={loading}>
      <Statistic
        title={title}
        value={formatValue()}
        prefix={prefix || icon}
        suffix={suffix || renderTrend()}
      />
    </Card>
  );
};

export default MetricCard;