// src/components/sections/ChartSection.jsx
import React, { useEffect, useState } from 'react';
import { Spin, Empty, Radio } from 'antd';
import { 
  generateLineChartConfig, 
  generateBarChartConfig, 
  generatePieChartConfig 
} from '../../utils/chartUtils';
import { LineChart, BarChart, PieChart } from '../visualizations';

const ChartSection = ({ section, loading }) => {
  const [chartConfig, setChartConfig] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  
  // Generate chart configuration based on data
  useEffect(() => {
    if (!section.data || section.data.length === 0) {
      setChartConfig(null);
      return;
    }
    
    // Determine metrics for the chart (excluding time-related fields)
    const allFields = Object.keys(section.data[0]);
    
    // Separate dimension fields (typically string values used for grouping)
    // from metric fields (typically numeric values to be visualized)
    const dimensionFields = [];
    const metricFields = [];
    
    allFields.forEach(field => {
      const values = section.data.map(item => item[field]);
      const isString = values.every(val => typeof val === 'string');
      const isDate = field.toLowerCase().includes('date') || field.toLowerCase().includes('time');
      const isIdentifier = field.toLowerCase().includes('id') || field.toLowerCase() === 'key';
      
      if (isString || isDate || isIdentifier) {
        dimensionFields.push(field);
      } else {
        metricFields.push(field);
      }
    });
    
    // Default selected metrics (first 1-3 metric fields)
    const defaultSelectedMetrics = metricFields.slice(0, Math.min(3, metricFields.length));
    
    // If no metrics previously selected, set defaults
    if (selectedMetrics.length === 0) {
      setSelectedMetrics(defaultSelectedMetrics);
    }
    
    // Choose a dimension field for the x-axis (prefer date/time fields)
    const xField = dimensionFields.find(field => 
      field.toLowerCase().includes('date') || 
      field.toLowerCase().includes('time') ||
      field.toLowerCase().includes('period')
    ) || dimensionFields[0] || 'index';
    
    // Generate chart configuration based on visualization type
    switch (section.visualizationType) {
      case 'line':
        setChartConfig(generateLineChartConfig(
          section.data,
          xField,
          selectedMetrics,
          section.title
        ));
        break;
      case 'bar':
        setChartConfig(generateBarChartConfig(
          section.data,
          xField,
          selectedMetrics,
          section.title,
          false
        ));
        break;
      case 'pie':
        // For pie charts, we need a dimension field and a single metric
        setChartConfig(generatePieChartConfig(
          section.data,
          dimensionFields[0] || 'category',
          selectedMetrics[0] || metricFields[0],
          section.title
        ));
        break;
      default:
        setChartConfig(null);
    }
  }, [section.data, section.visualizationType, section.title, selectedMetrics]);
  
  // Handle metric selection change
  const handleMetricChange = (e) => {
    setSelectedMetrics([e.target.value]);
  };
  
  // Render metric selector for pie charts
  const renderMetricSelector = () => {
    if (section.visualizationType !== 'pie' || 
        !section.data || 
        section.data.length === 0) {
      return null;
    }
    
    const metricFields = Object.keys(section.data[0]).filter(field => {
      const values = section.data.map(item => item[field]);
      return !values.every(val => typeof val === 'string');
    });
    
    return (
      <div style={{ marginBottom: 16 }}>
        <Radio.Group 
          value={selectedMetrics[0]} 
          onChange={handleMetricChange}
          buttonStyle="solid"
          size="small"
        >
          {metricFields.map(field => (
            <Radio.Button value={field} key={field}>
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    );
  };
  
  // Render appropriate chart based on visualization type
  const renderChart = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Spin />
        </div>
      );
    }
    
    if (!section.data || section.data.length === 0 || !chartConfig) {
      return (
        <Empty description="No data available" style={{ margin: '40px 0' }} />
      );
    }
    
    switch (section.visualizationType) {
      case 'line':
        return <LineChart config={chartConfig} />;
      case 'bar':
        return <BarChart config={chartConfig} />;
      case 'pie':
        return <PieChart config={chartConfig} />;
      default:
        return <div>Unsupported chart type: {section.visualizationType}</div>;
    }
  };
  
  return (
    <div>
      {renderMetricSelector()}
      {renderChart()}
    </div>
  );
};

export default ChartSection;