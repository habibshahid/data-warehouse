const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');
const { buildQuery } = require('../utils/queryBuilder');

// Create a connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Model for contact center statistics data
 */
const ContactCenterStats = {
  // Get metadata (available channels, queues, etc.)
  async getMetadata() {
    try {
      const connection = await pool.getConnection();
      
      // Get available channels
      const [channels] = await connection.query(
        "SELECT DISTINCT channel FROM yovo_tbl_contact_center_stats_daily"
      );
      
      // Get available queues
      const [queues] = await connection.query(
        "SELECT DISTINCT queue FROM yovo_tbl_contact_center_stats_daily"
      );
      
      // Get metrics (column names)
      const [columns] = await connection.query(
        "SHOW COLUMNS FROM yovo_tbl_contact_center_stats_daily"
      );
      
      // Filter out metadata columns like id, pKey, etc.
      const metaColumns = ['id', 'pKey', 'timeInterval', 'intervalType', 'year', 'week', 'weekOfYear', 'month', 'day', 'hour', 'createdAt', 'updatedAt'];
      const metrics = columns
        .map(col => col.Field)
        .filter(colName => !metaColumns.includes(colName));
      
      connection.release();
      
      return {
        channels: channels.map(c => c.channel),
        queues: queues.map(q => q.queue),
        metrics
      };
    } catch (error) {
      console.error('Error getting metadata:', error);
      throw error;
    }
  },
  
  // Get dashboard data based on filters
  async getDashboardData(reportType, timeInterval, startDate, endDate, channel, queue, agent, metrics, groupBy) {
    try {
      const connection = await pool.getConnection();
      
      const query = buildQuery(reportType, timeInterval, startDate, endDate, channel, queue, agent, metrics, groupBy);
      console.log('Executing query:', query);
      
      const [results] = await connection.query(query);
      
      connection.release();
      
      return results;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
};

module.exports = ContactCenterStats;