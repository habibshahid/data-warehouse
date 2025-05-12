import React from 'react';
import { Empty } from 'antd';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChart = ({ config }) => {
  if (!config || !config.data || config.data.length === 0) {
    return <Empty description="No data available for chart" />;
  }

  const { data, xField, yField, seriesField, title, color, isHorizontal } = config;
  
  // If seriesField is provided, we need to create multiple bars
  if (seriesField) {
    // Get unique values of seriesField
    const uniqueSeries = [...new Set(data.map(item => item[seriesField]))];
    
    if (isHorizontal) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey={xField} type="category" />
            <Tooltip />
            <Legend />
            {uniqueSeries.map((series, index) => (
              <Bar
                key={series}
                dataKey={(item) => item[seriesField] === series ? item[yField] : null}
                name={series}
                fill={color ? color[index % color.length] : undefined}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xField} />
          <YAxis />
          <Tooltip />
          <Legend />
          {uniqueSeries.map((series, index) => (
            <Bar
              key={series}
              dataKey={(item) => item[seriesField] === series ? item[yField] : null}
              name={series}
              fill={color ? color[index % color.length] : undefined}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }
  
  // Simple bar chart with single bar
  if (isHorizontal) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey={xField} type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey={yField} fill="#1890ff" />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yField} fill="#1890ff" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;