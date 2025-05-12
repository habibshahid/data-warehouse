// src/utils/queryBuilder.js
// This utility builds SQL queries for fetching data based on parameters

// Map time interval to corresponding table name
const getTableName = (timeInterval) => {
  const tableMap = {
    '15min': 'yovo_tbl_call_center_stats_15_min',
    '30min': 'yovo_tbl_contact_center_stats_half_hourly',
    'hourly': 'yovo_tbl_contact_center_stats_hourly',
    'daily': 'yovo_tbl_contact_center_stats_daily',
    'monthly': 'yovo_tbl_contact_center_stats_monthly',
    'yearly': 'yovo_tbl_contact_center_stats_yearly',
  };
  
  return tableMap[timeInterval] || 'yovo_tbl_contact_center_stats_daily';
};

// Build date filtering conditions based on time interval
const buildDateConditions = (timeInterval, startDate, endDate) => {
  if (!startDate && !endDate) {
    return '';
  }
  
  const conditions = [];
  
  if (startDate) {
    const date = new Date(startDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    const hour = date.getHours();
    
    conditions.push(`(
      year > ${year} OR 
      (year = ${year} AND month > ${month}) OR 
      (year = ${year} AND month = ${month} AND day >= ${day})
    )`);
    
    if (timeInterval === '15min' || timeInterval === '30min' || timeInterval === 'hourly') {
      conditions[conditions.length - 1] = conditions[conditions.length - 1].replace('day >= ${day}', `day > ${day} OR (day = ${day} AND hour >= ${hour})`);
    }
  }
  
  if (endDate) {
    const date = new Date(endDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    
    conditions.push(`(
      year < ${year} OR 
      (year = ${year} AND month < ${month}) OR 
      (year = ${year} AND month = ${month} AND day <= ${day})
    )`);
    
    if (timeInterval === '15min' || timeInterval === '30min' || timeInterval === 'hourly') {
      conditions[conditions.length - 1] = conditions[conditions.length - 1].replace('day <= ${day}', `day < ${day} OR (day = ${day} AND hour <= ${hour})`);
    }
  }
  
  return conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
};

// Build filter conditions for queues and channels
const buildFilterConditions = (filters) => {
  const conditions = [];
  
  if (filters.queues && filters.queues.length > 0) {
    const queuesString = filters.queues.map(q => `'${q}'`).join(', ');
    conditions.push(`queue IN (${queuesString})`);
  }
  
  if (filters.channels && filters.channels.length > 0) {
    const channelsString = filters.channels.map(c => `'${c}'`).join(', ');
    conditions.push(`channel IN (${channelsString})`);
  }
  
  return conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
};

// Build GROUP BY clause based on groupBy parameter
const buildGroupByClause = (groupBy) => {
  if (!groupBy) return '';
  
  return ` GROUP BY ${groupBy}`;
};

// Build the main SQL query
export const buildQuery = (params) => {
  const {
    timeInterval,
    startDate,
    endDate,
    columns = ['*'],
    filters = {},
    groupBy,
    visualizationType,
  } = params;
  
  const tableName = getTableName(timeInterval);
  const columnsString = columns.join(', ');
  
  // Start building the query
  let query = `SELECT ${columnsString} FROM ${tableName} WHERE 1=1`;
  
  // Add date range conditions
  query += buildDateConditions(timeInterval, startDate, endDate);
  
  // Add filter conditions for queues and channels
  query += buildFilterConditions(filters);
  
  // Add GROUP BY if specified
  query += buildGroupByClause(groupBy);
  
  // For certain visualization types, we might want to add ORDER BY
  if (visualizationType === 'line' || visualizationType === 'bar') {
    if (timeInterval === '15min') {
      query += ` ORDER BY year, month, day, hour, interval`;
    } else if (timeInterval === '30min' || timeInterval === 'hourly') {
      query += ` ORDER BY year, month, day, hour`;
    } else if (timeInterval === 'daily') {
      query += ` ORDER BY year, month, day`;
    } else if (timeInterval === 'monthly') {
      query += ` ORDER BY year, month`;
    } else if (timeInterval === 'yearly') {
      query += ` ORDER BY year`;
    }
  }
  
  return query;
};