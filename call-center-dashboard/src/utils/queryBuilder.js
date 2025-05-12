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
  
  // Determine the date column based on time interval
  let dateColumn;
  switch (timeInterval) {
    case '15min':
    case '30min':
    case 'hourly':
    case 'daily':
    case 'yearly':
      dateColumn = 'timeInterval';
      break;
    case 'monthly':
      dateColumn = 'pKey';
      break;
    default:
      dateColumn = 'timeInterval';
  }
  
  // Format dates based on the interval type
  if (startDate) {
    let formattedStartDate;
    switch (timeInterval) {
      case '15min':
      case '30min':
        formattedStartDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'hourly':
        formattedStartDate = moment(startDate).format('YYYY-MM-DD HH:00:00');
        break;
      case 'daily':
        formattedStartDate = moment(startDate).format('YYYY-MM-DD');
        break;
      case 'monthly':
        formattedStartDate = moment(startDate).format('YYYY-MM');
        break;
      case 'yearly':
        formattedStartDate = moment(startDate).format('YYYY');
        break;
      default:
        formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    }
    
    conditions.push(`${dateColumn} >= '${formattedStartDate}'`);
  }
  
  if (endDate) {
    let formattedEndDate;
    switch (timeInterval) {
      case '15min':
      case '30min':
        formattedEndDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'hourly':
        formattedEndDate = moment(endDate).format('YYYY-MM-DD HH:00:00');
        break;
      case 'daily':
        formattedEndDate = moment(endDate).format('YYYY-MM-DD');
        break;
      case 'monthly':
        formattedEndDate = moment(endDate).format('YYYY-MM');
        break;
      case 'yearly':
        formattedEndDate = moment(endDate).format('YYYY');
        break;
      default:
        formattedEndDate = moment(endDate).format('YYYY-MM-DD');
    }
    
    conditions.push(`${dateColumn} <= '${formattedEndDate}'`);
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
    // Determine the date column based on time interval
    let dateColumn;
    switch (timeInterval) {
      case '15min':
      case '30min':
      case 'hourly':
      case 'daily':
      case 'yearly':
        dateColumn = 'timeInterval';
        break;
      case 'monthly':
        dateColumn = 'pKey';
        break;
      default:
        dateColumn = 'timeInterval';
    }
    
    query += ` ORDER BY ${dateColumn}`;
  }
  
  return query;
};