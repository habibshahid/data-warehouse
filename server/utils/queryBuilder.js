/**
 * Builds SQL query for dashboard data based on filters
 */
const buildQuery = (reportType, timeInterval, startDate, endDate, channel, queue, agent, metrics, groupBy) => {
    // Determine which table to query based on the report type and time interval
    let tableName;
    if (reportType === 'contact_center') {
      if(timeInterval === '15_min'){
        tableName = `yovo_tbl_call_center_stats_${timeInterval}`;
      }
      else{
        tableName = `yovo_tbl_contact_center_stats_${timeInterval}`; 
      }
    } else {
      tableName = `yovo_tbl_agent_summary_stats_${timeInterval}`;
    }
  
    // Build the SELECT clause with metrics and appropriate date field
  let selectFields = [];
  
  // Determine the date field based on the time interval
  if (timeInterval === 'daily') {
    selectFields.push(`CONCAT(year, '-', LPAD(month, 2, '0'), '-', LPAD(day, 2, '0')) AS date`);
  } else if (timeInterval === 'hourly' || timeInterval === 'half_hourly' || timeInterval === '15_min') {
    selectFields.push(`timeInterval AS date`);
  } else if (timeInterval === 'monthly') {
    selectFields.push(`CONCAT(year, '-', LPAD(month, 2, '0')) AS date`);
  } else if (timeInterval === 'yearly') {
    selectFields.push(`timeInterval AS date`);
  }
  
  // Add all requested metrics to SELECT
  metrics.forEach(metric => {
    selectFields.push(`${metric}`);
  });
  
  // Build WHERE clause
  let whereConditions = [];
  
  // Date filtering based on time interval
  if (timeInterval === 'daily' || timeInterval === 'hourly' || timeInterval === 'half_hourly' || timeInterval === '15_min') {
    whereConditions.push(`timeInterval BETWEEN '${startDate}' AND '${endDate} 23:59:59'`);
  } else if (timeInterval === 'monthly') {
    // Extract year and month from dates
    const startYear = startDate.substring(0, 4);
    const startMonth = startDate.substring(5, 7);
    const endYear = endDate.substring(0, 4);
    const endMonth = endDate.substring(5, 7);
    
    whereConditions.push(`(year > ${startYear} OR (year = ${startYear} AND month >= ${parseInt(startMonth)}))`);
    whereConditions.push(`(year < ${endYear} OR (year = ${endYear} AND month <= ${parseInt(endMonth)}))`);
  } else if (timeInterval === 'yearly') {
    // Extract year from dates
    const startYear = startDate.substring(0, 4);
    const endYear = endDate.substring(0, 4);
    
    whereConditions.push(`timeInterval BETWEEN ${startYear} AND ${endYear}`);
  }
  
  // Filter by channel, queue, and agent if specified
  if (channel !== 'all') {
    whereConditions.push(`channel = '${channel}'`);
  }
  
  if (queue !== 'all') {
    whereConditions.push(`queue = '${queue}'`);
  }
  
  if (agent !== 'all' && reportType === 'agent') {
    whereConditions.push(`agent = '${agent}'`);
  }
  
  // Build the final query
  const query = `
    SELECT ${selectFields.join(', ')}
    FROM ${tableName}
    ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
    ORDER BY date
  `;
  
  return query;
};

module.exports = {
  buildQuery
};