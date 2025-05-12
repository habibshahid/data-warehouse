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
    if (!section || !section.data || section.data.length === 0) {
      setChartConfig(null);
      return;
    }
    
    try {
      // Get the chartOptions from section props
      const chartOptions = section.chartOptions || {};
      
      // Get all fields
      const allFields = Object.keys(section.data[0]);
      
      // Separate dimension fields from metric fields
      const dimensionFields = [];
      const metricFields = [];
      
      allFields.forEach(field => {
        if (!field) return; // Skip if field is undefined
        
        const values = section.data.map(item => item[field]);
        const isString = values.every(val => typeof val === 'string');
        const isDate = field.toLowerCase().includes('date') || 
                      field === 'timeInterval' || 
                      field === 'pKey' ||
                      field === 'period';
        const isIdentifier = field.toLowerCase().includes('id') || field.toLowerCase() === 'key';
        
        if (isString || isDate || isIdentifier) {
          dimensionFields.push(field);
        } else {
          metricFields.push(field);
        }
      });
      
      // Default selected metrics
      const defaultSelectedMetrics = metricFields.slice(0, Math.min(3, metricFields.length));
      
      // If no metrics previously selected, set defaults
      if (selectedMetrics.length === 0) {
        setSelectedMetrics(defaultSelectedMetrics);
      }
      
      // For charts, prefer 'period' field for x-axis if it exists,
      // otherwise look for other date/time fields
      const xField = 
        allFields.includes('period') ? 'period' :
        dimensionFields.find(field => 
          field === 'timeInterval' || 
          field === 'pKey' || 
          field.toLowerCase().includes('date') || 
          field.toLowerCase().includes('time')
        ) || dimensionFields[0] || 'index';
      
      // Generate chart config
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
            chartOptions?.horizontal || false,
            chartOptions
          ));
          break;
        case 'pie':
          // For pie charts, we need a dimension field and a single metric
          setChartConfig(generatePieChartConfig(
            section.data,
            dimensionFields[0] || 'category',
            selectedMetrics[0] || metricFields[0],
            section.title,
            chartOptions
          ));
          break;
        default:
          setChartConfig(null);
      }
    } catch (error) {
      console.error("Error generating chart config:", error);
      setChartConfig(null);
    }
  }, [section, selectedMetrics]);
  
  // Handle metric selection change
  const handleMetricChange = (e) => {
    setSelectedMetrics([e.target.value]);
  };
  
  // Render metric selector for pie charts
  const renderMetricSelector = () => {
    if (!section || section.visualizationType !== 'pie' || 
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
    
    if (!section || !section.data || section.data.length === 0 || !chartConfig) {
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
  
  // Safety check if section is not defined
  if (!section) {
    return <Empty description="Section configuration is missing" />;
  }
  
  return (
    <div>
      {renderMetricSelector()}
      {renderChart()}
    </div>
  );
};

export default ChartSection;