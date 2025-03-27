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
    
    // Format percentages
    if (metric.toLowerCase().includes('percentage')) {
      return value ? `${value.toFixed(2)}%` : 'N/A';
    }
    
    // Format numbers with 2 decimal places
    return value !== undefined && value !== null ? value.toFixed(2) : 'N/A';
  };