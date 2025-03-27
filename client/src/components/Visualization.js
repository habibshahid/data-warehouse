// File: client/src/components/Visualization.js
  import React from 'react';
  import { 
    LineChart, Line, 
    BarChart, Bar, 
    PieChart, Pie, Cell,
    AreaChart, Area, 
    XAxis, YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
  } from 'recharts';
  import { formatMetricValue } from '../utils/formatters';
  
  /**
   * Component for rendering different chart visualizations
   */
  const Visualization = ({ data, chartType, metrics }) => {
    if (!data || data.length === 0) {
      return <div className="p-4 text-center">No data available for the selected filters.</div>;
    }
    
    // Configure colors for the charts
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    // Custom tooltip formatter that handles time values
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 border border-gray-200 shadow-md">
            <p className="font-bold text-gray-700">{`Date: ${label}`}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${formatMetricValue(entry.value, entry.name)}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };
    
    // Render different chart types
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.map((metric, index) => (
                <Line 
                  key={metric} 
                  type="monotone" 
                  dataKey={metric} 
                  stroke={colors[index % colors.length]} 
                  name={metric}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.map((metric, index) => (
                <Bar 
                  key={metric} 
                  dataKey={metric} 
                  fill={colors[index % colors.length]} 
                  name={metric}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.map((metric, index) => (
                <Area 
                  key={metric} 
                  type="monotone" 
                  dataKey={metric} 
                  fill={colors[index % colors.length]} 
                  stroke={colors[index % colors.length]} 
                  fillOpacity={0.6}
                  name={metric}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        // Aggregate data for pie chart
        const aggregatedData = metrics.map(metric => {
          const sum = data.reduce((total, item) => total + (Number(item[metric]) || 0), 0);
          return { name: metric, value: sum };
        });
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {aggregatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [formatMetricValue(value, name), name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="p-4 text-center">Invalid chart type selected.</div>
        );
    }
  };
  
  export default Visualization;