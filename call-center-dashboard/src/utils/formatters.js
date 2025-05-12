// Utility for formatting data values

// Format number with commas for thousands
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-';
  
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format percentage values
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  return `${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
};

// Format time duration in seconds
export const formatDuration = (seconds, format = 'hh:mm:ss') => {
  if (seconds === null || seconds === undefined) return '-';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (format === 'hh:mm:ss') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else if (format === 'natural') {
    const parts = [];
    
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }
    
    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }
    
    if (remainingSeconds > 0 || parts.length === 0) {
      parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`);
    }
    
    return parts.join(' ');
  }
  
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

// Format time in seconds to mm:ss
export const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined) return '-';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};