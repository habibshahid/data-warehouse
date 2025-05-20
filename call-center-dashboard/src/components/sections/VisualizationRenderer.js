// src/components/dashboard/VisualizationRenderer.jsx
import React from 'react';
import { Empty } from 'antd';
import { LineChart, BarChart, PieChart, DataTable, MetricCard } from '../visualizations';

const VisualizationRenderer = ({ type, data, section, chartOptions }) => {
  if (!data || data.length === 0) {
    return <Empty description="No data available" />;
  }

  // Prepare config for the visualizations
  const getChartConfig = () => {
    const config = {
      data: data,
      chartOptions: chartOptions || {},
    };

    // Add specific configs based on visualization type
    switch (type) {
      case 'line':
        return {
          ...config,
          xField: 'period',
          yField: section.columns || [],
          seriesField: section.groupBy,
          title: section.title,
        };
      case 'bar':
        return {
          ...config,
          xField: 'period',
          yField: section.columns && section.columns.length > 0 ? section.columns[0] : null,
          seriesField: section.groupBy,
          title: section.title,
          isHorizontal: chartOptions?.horizontal || false,
        };
      case 'pie':
        // For pie charts, we need a different approach
        // If groupBy is specified, use that as the field for pie segments
        // Otherwise, use the first column as the value field
        return {
          ...config,
          angleField: section.columns && section.columns.length > 0 ? section.columns[0] : null,
          colorField: section.groupBy || 'period',
          radius: 0.8,
          title: section.title,
        };
      case 'table':
      default:
        return config;
    }
  };

  // Render the appropriate visualization
  switch (type) {
    case 'line':
      return <LineChart config={getChartConfig()} />;
    case 'bar':
      return <BarChart config={getChartConfig()} />;
    case 'pie':
      return <PieChart config={getChartConfig()} />;
    case 'card':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {section.columns?.map((column, index) => {
            // Calculate the value for the card (sum or average depending on the column)
            const isAverage = column.toLowerCase().includes('avg') ||
              column.toLowerCase().includes('average');

            let value = 0;
            if (isAverage) {
              const sum = data.reduce((acc, item) => acc + (item[column] || 0), 0);
              value = sum / data.length;
            } else {
              value = data.reduce((acc, item) => acc + (item[column] || 0), 0);
            }

            return (
              <MetricCard
                key={index}
                title={column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={value}
                format={
                  column.toLowerCase().includes('time') ? 'duration' :
                    column.toLowerCase().includes('percentage') ? 'percentage' : 'number'
                }
              />
            );
          })}
        </div>
      );
    case 'table':
    default:
      return <DataTable data={data} />;
  }
};

export default VisualizationRenderer;