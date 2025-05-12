// src/utils/chartUtils.js
// Utility functions for chart configuration

// Generate colors for charts
export const generateChartColors = (count) => {
  const baseColors = [
    '#1890ff', // Blue
    '#52c41a', // Green
    '#faad14', // Yellow
    '#f5222d', // Red
    '#722ed1', // Purple
    '#13c2c2', // Cyan
    '#fa8c16', // Orange
    '#eb2f96', // Pink
    '#a0d911', // Lime
    '#1da57a', // Teal
  ];
  
  // If we need more colors than we have in the base colors array,
  // we'll generate additional colors by adjusting brightness
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  const colors = [...baseColors];
  
  // Generate additional colors by adjusting brightness
  while (colors.length < count) {
    const colorIndex = colors.length % baseColors.length;
    const baseColor = baseColors[colorIndex];
    
    // Adjust brightness to create a new color
    const factor = 0.8 + (0.4 * (Math.floor(colors.length / baseColors.length) / 5));
    const adjustedColor = adjustBrightness(baseColor, factor);
    
    colors.push(adjustedColor);
  }
  
  return colors;
};

// Adjust color brightness
const adjustBrightness = (hexColor, factor) => {
  // Convert hex to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);
  
  // Adjust brightness
  r = Math.min(255, Math.round(r * factor));
  g = Math.min(255, Math.round(g * factor));
  b = Math.min(255, Math.round(b * factor));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Format data for line chart
export const formatLineChartData = (data, xField, yFields) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  return data.map(item => {
    // Start with the x-axis field (priority to 'period' if it exists)
    const result = { 
      [xField]: item[xField],
      // Include period separately if it exists and is not the xField
      ...(item.period && xField !== 'period' ? { period: item.period } : {})
    };
    
    // Add all y fields
    yFields.forEach(field => {
      result[field] = item[field];
    });
    
    return result;
  });
};

// Format data for bar chart
export const formatBarChartData = (data, xField, yFields) => {
  // Similar to line chart data formatting
  return formatLineChartData(data, xField, yFields);
};

// Format data for pie chart
export const formatPieChartData = (data, nameField, valueField) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  return data.map(item => ({
    name: item[nameField],
    value: item[valueField],
  }));
};

// Generate configuration for line chart
export const generateLineChartConfig = (data, xField, yFields, title) => {
  // Prefer using 'period' as the xField if it exists
  const preferredXField = data && data[0] && data[0].period ? 'period' : xField;
  
  const formattedData = formatLineChartData(data, preferredXField, yFields);
  const colors = generateChartColors(yFields.length);
  
  return {
    data: formattedData,
    xField: preferredXField,
    yField: yFields,
    seriesField: null,
    title: {
      text: title || '',
      style: {
        fontSize: 14,
        fontWeight: 500,
      },
    },
    legend: {
      position: 'top-right',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: colors,
  };
};

// Generate configuration for bar chart
export const generateBarChartConfig = (data, xField, yFields, title, isHorizontal = false) => {
  // Prefer using 'period' as the xField if it exists
  const preferredXField = data && data[0] && data[0].period ? 'period' : xField;
  
  const formattedData = formatBarChartData(data, preferredXField, yFields);
  const colors = generateChartColors(yFields.length);
  
  return {
    data: formattedData,
    xField: isHorizontal ? yFields[0] : preferredXField,
    yField: isHorizontal ? preferredXField : yFields[0],
    seriesField: null,
    title: {
      text: title || '',
      style: {
        fontSize: 14,
        fontWeight: 500,
      },
    },
    legend: yFields.length > 1 ? {
      position: 'top-right',
    } : false,
    barStyle: {
      fill: colors[0],
    },
    label: {
      position: isHorizontal ? 'right' : 'top',
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    animation: {
      appear: {
        animation: 'grow-in-xy',
        duration: 1000,
      },
    },
  };
};

// Generate configuration for pie chart
export const generatePieChartConfig = (data, nameField, valueField, title) => {
  const formattedData = formatPieChartData(data, nameField, valueField);
  const colors = generateChartColors(formattedData.length);
  
  return {
    data: formattedData,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.5,
    title: {
      text: title || '',
      style: {
        fontSize: 14,
        fontWeight: 500,
      },
    },
    legend: {
      position: 'right',
    },
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Total',
      },
    },
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
    color: colors,
  };
};