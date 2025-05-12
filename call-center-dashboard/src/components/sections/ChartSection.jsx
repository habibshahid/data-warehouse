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
      
      // Identify the best date/time field to use for charts
      const getDateField = (data) => {
        // First check if 'period' exists (which is already formatted for display)
        if (data[0] && data[0].period) return 'period';
        
        // Otherwise, check for standard date columns based on time interval
        const possibleDateColumns = [
          'timeInterval', 'pKey', 'date', 'time', 
          'year', 'month', 'day', 'hour'
        ];
        
        for (const column of possibleDateColumns) {
          if (data[0] && data[0][column] !== undefined) return column;
        }
        
        // Fallback to the first field that looks like a date
        return allFields.find(field => 
          field.toLowerCase().includes('date') || 
          field.toLowerCase().includes('time')
        ) || allFields[0];
      };
      
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
      
      // Use selected columns if provided, otherwise use the first few metric fields
      let metricsToUse = [];
      if (section.columns && section.columns.length > 0) {
        // Filter out any date fields from columns (they should go on the x-axis)
        metricsToUse = section.columns.filter(col => !dimensionFields.includes(col));
        // If no metrics left after filtering, add the first metric
        if (metricsToUse.length === 0 && metricFields.length > 0) {
          metricsToUse = [metricFields[0]];
        }
      } else {
        // Default to first few metrics
        metricsToUse = metricFields.slice(0, Math.min(3, metricFields.length));
      }
      
      // If no metrics previously selected, set from the metrics to use
      if (selectedMetrics.length === 0) {
        setSelectedMetrics(metricsToUse);
      }
      
      // For charts, first use the date field we identified
      const xField = getDateField(section.data);
      
      // Generate chart config based on visualization type
      switch (section.visualizationType) {
        case 'line':
          // For line charts, ensure we have the right data structure
          if (section.data.length === 1) {
            // Single data point scenario - we can either:
            // 1. Show a simple point (not very useful visually)
            // 2. Create a simulated trend (what we're doing here)
            
            // Get the single data point
            const singleDataPoint = section.data[0];
            const periodLabel = singleDataPoint.period || "Period";
            
            // Create a simple dataset that can be rendered
            const lineData = [{
              period: periodLabel,
              ...singleDataPoint
            }];
            
            // Special config for single data point
            setChartConfig({
              data: lineData,
              xField: 'period',
              yField: metricsToUse,
              seriesField: null,
              title: section.title,
              isGroup: true,
              // Add a note about single data point
              tooltip: {
                formatter: (datum) => ({
                  name: datum.name,
                  value: datum.value,
                  title: `${periodLabel} (Single point view)`,
                }),
              }
            });
          } else {
            // Multiple data points - normal line chart
            // Explicitly prepare the data to ensure it's in the right format
            const lineData = section.data.map(item => {
              // Ensure there's a period field for each item
              const mappedItem = {
                period: item.period || item[xField],
                ...item
              };
              return mappedItem;
            });
            
            // Use our line chart generation function with explicit data
            setChartConfig({
              data: lineData,
              xField: 'period',
              yField: metricsToUse,
              seriesField: null,
              title: section.title
            });
          }
          break;
        case 'bar':
          // For bar charts with only one data point, transform the data
          if (section.data.length === 1 && metricsToUse.length > 1) {
            // Get the single data point
            const singleDataPoint = section.data[0];
            
            // Transform to compare different metrics
            const transformedData = metricsToUse.map(metric => ({
              metric: metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
              value: singleDataPoint[metric] || 0
            })).filter(item => item.value > 0);
            
            setChartConfig({
              data: transformedData,
              xField: 'metric',
              yField: 'value',
              seriesField: null,
              title: section.title,
              isHorizontal: chartOptions?.horizontal || false
            });
          } else {
            setChartConfig(generateBarChartConfig(
              section.data,
              xField,
              metricsToUse,
              section.title,
              chartOptions?.horizontal || false,
              chartOptions
            ));
          }
          break;
        case 'pie':
          // For pie charts with only one data point, we need to transform the data
          // to create multiple segments from the metrics
          if (section.data.length === 1) {
            // Get the single data point
            const singleDataPoint = section.data[0];
            
            // Transform the data to show metrics as separate segments
            const transformedData = metricsToUse.map(metric => ({
              name: metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
              value: singleDataPoint[metric] || 0
            })).filter(item => item.value > 0);
            
            // Use the transformed data for the pie chart
            setChartConfig({
              data: transformedData,
              angleField: 'value',
              colorField: 'name',
              radius: 0.8,
              title: section.title,
              color: chartOptions?.colors
            });
          } else {
            // Regular pie chart with multiple data points
            let dimensionField = dimensionFields.find(field => field !== xField);
            if (!dimensionField) {
              // If no other dimension field, use the date field
              dimensionField = xField;
            }
            
            // Use the first selected/specified metric for pie chart
            const valueField = (metricsToUse.length > 0) ? metricsToUse[0] : metricFields[0];
            
            setChartConfig(generatePieChartConfig(
              section.data,
              dimensionField || 'category',
              valueField,
              section.title,
              chartOptions
            ));
          }
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
    
    // Only show numeric fields
    const metricFields = Object.keys(section.data[0]).filter(field => {
      if (!field) return false;
      const values = section.data.map(item => item[field]);
      const isNumeric = values.some(val => typeof val === 'number');
      return isNumeric;
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