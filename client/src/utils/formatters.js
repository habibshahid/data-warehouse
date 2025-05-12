// File: client/src/utils/formatters.js
/**
 * Formats seconds into HH:MM:SS format
 */
export const formatTimeValue = (seconds) => {
  if (seconds === undefined || seconds === null) return 'N/A';
  
  seconds = Number(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formats value based on metric type
 */
export const formatMetricValue = (value, metric) => {
  // Handle null or undefined values
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  const timeMetrics = [
    'loginTime', 'breakTime', 'idleTime', 'talkTimeInbound', 
    'talkTimeOutbound', 'acwTime', 'holdTimeAvg', 'queueWaitTimeAvg', 
    'inboundInteractionTimeAvg', 'outboundInteractionTimeAvg',
    'holdTimeOccupancy', 'acwOccupancyTime', 'connectedOccupancyTimeInbound',
    'connectedOccupancyTimeOutbound'
  ];
  
  if (timeMetrics.includes(metric)) {
    return formatTimeValue(value);
  }
  
  // Convert to number if not already a number
  const numValue = typeof value === 'number' ? value : Number(value);
  
  // Check if the conversion resulted in a valid number
  if (isNaN(numValue)) {
    return value.toString(); // Return as string if not a valid number
  }
  
  // Format percentages
  if (metric.toLowerCase().includes('percentage')) {
    return `${numValue.toFixed(2)}%`;
  }
  
  // Format numbers with 2 decimal places
  return numValue.toFixed(2);
};