/**
 * Builds SQL query for dashboard data based on filters
 */
const buildQuery = (reportType, timeInterval, startDate, endDate, channel, queue, agent, metrics, groupBy) => {
    // Determine which table to query based on the report type and time interval
    let tableName;
    if (reportType === 'contact_center') {
      tableName = `yovo_tbl_contact_center_stats_${timeInterval}`;
    } else {
      tableName = `yovo_tbl_agent_summary_stats_${timeInterval}`;
    }
  
    // Build the SELECT clause based on the requested metrics
    let selectClause = '';
    
    // Group by fields based on the groupBy parameter
    let groupByClause = '';
    let wherePKeyCondition = '';
    
    // Handle different time intervals
    if (timeInterval === 'daily' || timeInterval === 'hourly' || timeInterval === 'half_hourly' || timeInterval === '15_min') {
      // For daily and more granular data
      if (groupBy === 'day') {
        selectClause = `CONCAT(year, '-', LPAD(month, 2, '0'), '-', LPAD(day, 2, '0')) AS date`;
        groupByClause = `GROUP BY year, month, day`;
      } else if (groupBy === 'month') {
        selectClause = `CONCAT(year, '-', LPAD(month, 2, '0')) AS date`;
        groupByClause = `GROUP BY year, month`;
      } else if (groupBy === 'week') {
        selectClause = `CONCAT(year, '-W', LPAD(weekOfYear, 2, '0')) AS date`;
        groupByClause = `GROUP BY year, weekOfYear`;
      } else {
        // No grouping, use timeInterval directly
        selectClause = `timeInterval AS date`;
      }
      
      wherePKeyCondition = `WHERE timeInterval BETWEEN '${startDate}' AND '${endDate} 23:59:59'`;
    } else if (timeInterval === 'monthly') {
      selectClause = `CONCAT(year, '-', LPAD(month, 2, '0')) AS date`;
      if (groupBy === 'month') {
        groupByClause = `GROUP BY year, month`;
      }
      
      // Extract year and month from dates
      const startYear = startDate.substring(0, 4);
      const startMonth = startDate.substring(5, 7);
      const endYear = endDate.substring(0, 4);
      const endMonth = endDate.substring(5, 7);
      
      wherePKeyCondition = `WHERE (year > ${startYear} OR (year = ${startYear} AND month >= ${parseInt(startMonth)})) 
                            AND (year < ${endYear} OR (year = ${endYear} AND month <= ${parseInt(endMonth)}))`;
    } else if (timeInterval === 'yearly') {
      selectClause = `timeInterval AS date`;
      
      // Extract year from dates
      const startYear = startDate.substring(0, 4);
      const endYear = endDate.substring(0, 4);
      
      wherePKeyCondition = `WHERE timeInterval BETWEEN ${startYear} AND ${endYear}`;
    }
    
    // Add metrics to the SELECT clause
    metrics.forEach(metric => {
      if (groupBy && groupBy !== 'none') {
        selectClause += `, AVG(${metric}) AS ${metric}`;
      } else {
        selectClause += `, ${metric}`;
      }
    });
    
    // Build WHERE clause for filters
    let whereClause = wherePKeyCondition;
    
    if (channel !== 'all') {
      whereClause += ` AND channel = '${channel}'`;
    }
    
    if (queue !== 'all') {
      whereClause += ` AND queue = '${queue}'`;
    }
    
    if (agent !== 'all' && reportType === 'agent') {
      whereClause += ` AND agent = '${agent}'`;
    }
    
    // Build the final query
    let query;
    if (groupByClause) {
      query = `SELECT ${selectClause} FROM ${tableName} ${whereClause} ${groupByClause} ORDER BY date`;
    } else {
      query = `SELECT ${selectClause} FROM ${tableName} ${whereClause} ORDER BY date`;
    }
    
    return query;
  };
  
  module.exports = {
    buildQuery
  };