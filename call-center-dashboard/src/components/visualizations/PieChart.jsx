import React from 'react';
import { Empty } from 'antd';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#fa8c16', '#eb2f96'];

const PieChart = ({ config }) => {
  if (!config || !config.data || config.data.length === 0) {
    return <Empty description="No data available for chart" />;
  }

  const { data, angleField, colorField, radius = 0.8, color = COLORS } = config;
  
  // Format data for recharts if needed
  const formattedData = data.map(item => ({
    name: item[colorField],
    value: item[angleField]
  }));
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsPieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={180 * radius}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color[index % color.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, 'Value']} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;