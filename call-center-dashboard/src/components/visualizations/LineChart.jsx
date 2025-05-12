import React from 'react';
import { Empty } from 'antd';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChart = ({ config }) => {
  if (!config || !config.data || config.data.length === 0) {
    return <Empty description="No data available for chart" />;
  }

  const { data, xField, yField, seriesField, title, color } = config;
  
  // If seriesField is provided, we need to create multiple lines
  if (seriesField) {
    // Get unique values of seriesField
    const uniqueSeries = [...new Set(data.map(item => item[seriesField]))];
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xField} />
          <YAxis />
          <Tooltip />
          <Legend />
          {uniqueSeries.map((series, index) => (
            <Line
              key={series}
              type="monotone"
              dataKey={(item) => item[seriesField] === series ? item[yField] : null}
              name={series}
              stroke={color ? color[index % color.length] : undefined}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }
  
  // Simple line chart with single line
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={yField}
          stroke="#1890ff"
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;