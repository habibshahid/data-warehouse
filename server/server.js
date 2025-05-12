const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'call_center_db',
  logging: false,
});

// Load models
const models = {};

// Define the directory where your model files are located
const modelsDir = path.join(__dirname, 'models');

// Load all model files
fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const modelFile = require(path.join(modelsDir, file));
    const model = modelFile(sequelize, DataTypes);
    models[model.name] = model;
  });

// Define the table mapping for time intervals
const tableMapping = {
  '15min': 'yovo_tbl_call_center_stats_15_min',
  '30min': 'yovo_tbl_contact_center_stats_half_hourly',
  'hourly': 'yovo_tbl_contact_center_stats_hourly',
  'daily': 'yovo_tbl_contact_center_stats_daily',
  'monthly': 'yovo_tbl_contact_center_stats_monthly',
  'yearly': 'yovo_tbl_contact_center_stats_yearly',
};

// API Routes

// Metadata routes - Get queues from database
app.get('/api/metadata/queues', async (req, res) => {
  try {
    // Query the database to get all queues
    const queues = await sequelize.query(
      "SELECT DISTINCT name FROM yovo_tbl_queues",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    // Format for frontend select components
    const formattedQueues = queues.map(q => ({
      value: q.name,
      label: q.name,
    }));
    
    res.json(formattedQueues);
  } catch (error) {
    console.error('Error fetching queues:', error);
    res.status(500).json({ message: 'Failed to fetch queues' });
  }
});

// Get channels from database
app.get('/api/metadata/channels', async (req, res) => {
  try {
    // Query the database to get all channels
    const channels = await sequelize.query(
      "SELECT DISTINCT channel FROM yovo_tbl_channels",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    // Format for frontend select components
    const formattedChannels = channels.map(c => ({
      value: c.channel,
      label: c.channel,
    }));
    
    res.json(formattedChannels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ message: 'Failed to fetch channels' });
  }
});

// Get available metrics for a table
app.get('/api/metadata/metrics', async (req, res) => {
  try {
    const { tableName } = req.query;
    
    // Get the table name based on the provided parameter or fall back to daily stats
    const actualTableName = tableMapping[tableName] || tableMapping['daily'];
    
    // Get the table columns from the database
    const columnsQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
      AND TABLE_NAME = '${actualTableName}'
    `;
    
    const columns = await sequelize.query(columnsQuery, {
      type: sequelize.QueryTypes.SELECT
    });
    
    // Filter out system columns and add labels
    const metrics = columns
      .filter(col => {
        const name = col.COLUMN_NAME;
        return !['id', 'createdAt', 'updatedAt', 'pKey'].includes(name);
      })
      .map(col => {
        const name = col.COLUMN_NAME;
        // Convert camelCase to Title Case for the label
        const label = name
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        return {
          value: name,
          label: label,
        };
      });
    
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
});

// Dashboard data route
// Updated server.js dashboard data endpoint with simplified code
app.post('/api/dashboard/data', async (req, res) => {
  try {
    console.log('Received dashboard data request:', req.body);
    
    const { 
      timeInterval, 
      startDate, 
      endDate, 
      columns = ['*'], 
      filters = {},
      groupBy 
    } = req.body;
    
    // Get the appropriate table name based on time interval
    const tableName = tableMapping[timeInterval] || tableMapping['daily'];
    
    // Determine the date column based on time interval
    let dateColumn;
    switch (timeInterval) {
      case 'monthly':
        dateColumn = 'pKey';
        break;
      default:
        dateColumn = 'timeInterval';
    }

    // Build a proper SQL query
    let query = 'SELECT ';
    
    if (columns.includes('*') || columns.length === 0) {
      query += '*';
    } else {
      // Filter out any columns that don't exist in the current table
      let filteredColumns = [...columns];
      
      // Remove 'period' as it's a derived field we add later, not a database column
      filteredColumns = filteredColumns.filter(col => col !== 'period');
      
      // Table-specific column checking - avoid requesting columns that don't exist
      if (timeInterval === 'yearly') {
        // For yearly tables, filter out year column since timeInterval itself is the year
        filteredColumns = filteredColumns.filter(col => col !== 'year');
      }
      
      // Ensure dateColumn is in the columns list if not already
      if (!filteredColumns.includes(dateColumn)) {
        filteredColumns.push(dateColumn);
      }
      
      query += filteredColumns.join(', ');
    }
    
    // Add FROM clause with the table name
    query += ` FROM ${tableName} WHERE 1=1`;
    
    // Add date range conditions if provided
    if (startDate || endDate) {
      // Determine the appropriate date format for this time interval
      let dateFormat;
      
      switch (timeInterval) {
        case '15min':
        case '30min':
          dateFormat = 'YYYY-MM-DD HH:mm:ss';
          break;
        case 'hourly':
          dateFormat = 'YYYY-MM-DD HH:00:00';
          break;
        case 'daily':
          dateFormat = 'YYYY-MM-DD';
          break;
        case 'monthly':
          dateFormat = 'YYYY-MM';
          break;
        case 'yearly':
          dateFormat = 'YYYY';
          break;
        default:
          dateFormat = 'YYYY-MM-DD';
      }
      
      // Add start date condition
      if (startDate) {
        let formattedStartDate;
        
        // Special handling for yearly data
        if (timeInterval === 'yearly') {
          // For yearly data, just extract the year
          formattedStartDate = moment(startDate).format('YYYY');
        } else {
          formattedStartDate = moment(startDate).format(dateFormat);
        }
        
        query += ` AND ${dateColumn} >= '${formattedStartDate}'`;
      }
      
      // Add end date condition
      if (endDate) {
        let formattedEndDate;
        
        // Special handling for yearly data
        if (timeInterval === 'yearly') {
          // For yearly data, just extract the year
          formattedEndDate = moment(endDate).format('YYYY');
        } else {
          formattedEndDate = moment(endDate).format(dateFormat);
        }
        
        query += ` AND ${dateColumn} <= '${formattedEndDate}'`;
      }
    }
    
    // Add filter for queues if provided
    if (filters.queues && filters.queues.length > 0) {
      const queuesStr = filters.queues.map(q => `'${q}'`).join(', ');
      query += ` AND queue IN (${queuesStr})`;
    }
    
    // Add filter for channels if provided
    if (filters.channels && filters.channels.length > 0) {
      const channelsStr = filters.channels.map(c => `'${c}'`).join(', ');
      query += ` AND channel IN (${channelsStr})`;
    }
    
    // Add GROUP BY clause if specified
    if (groupBy) {
      query += ` GROUP BY ${groupBy}`;
    }
    
    // Add ORDER BY clause for consistent results
    query += ` ORDER BY ${dateColumn}`;
    
    console.log('Executing query:', query);
    
    // Execute the query
    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });
    
    // Add derived fields
    const results = data.map((row, index) => {
      // Add the period field with formatted date based on time interval
      let periodLabel;
      
      try {
        switch (timeInterval) {
          case '15min':
            // Try different field options
            if (row.interval) {
              // Extract from interval field (format: "2025-02-13 20:15:00_2025-02-13 20:29:59")
              periodLabel = row.interval.split('_')[0].substring(0, 16); // Get YYYY-MM-DD HH:MM
            } else if (row.timeInterval) {
              periodLabel = row.timeInterval.substring(0, 16); // Get YYYY-MM-DD HH:MM
            } else {
              periodLabel = `Period ${index + 1}`;
            }
            break;
          case '30min':
            if (row.timeInterval) {
              periodLabel = row.timeInterval.substring(0, 16); // Get YYYY-MM-DD HH:MM
            } else {
              periodLabel = `Period ${index + 1}`;
            }
            break;
          case 'hourly':
            if (row.timeInterval) {
              periodLabel = row.timeInterval.substring(0, 13); // Get YYYY-MM-DD HH
            } else {
              periodLabel = `Period ${index + 1}`;
            }
            break;
          case 'daily':
            if (row.timeInterval) {
              periodLabel = row.timeInterval.substring(0, 10); // Get YYYY-MM-DD
            } else {
              periodLabel = `Period ${index + 1}`;
            }
            break;
          case 'monthly':
            if (row.pKey && row.pKey.includes('-')) {
              periodLabel = row.pKey; // Already in YYYY-MM format
            } else {
              periodLabel = `Period ${index + 1}`;
            }
            break;
          case 'yearly':
            // For yearly table, timeInterval is just the year itself (e.g., "2025")
            if (row.timeInterval) {
              periodLabel = row.timeInterval; // Already in YYYY format
            } else {
              periodLabel = `Year ${index + 1}`;
            }
            break;
          default:
            periodLabel = row[dateColumn] || `Period ${index + 1}`;
        }
      } catch (error) {
        console.error('Error formatting period label:', error);
        periodLabel = `Period ${index + 1}`;
      }
      
      // Just add period and key fields, don't add unnecessary fields
      return {
        ...row,
        period: periodLabel,
        key: index
      };
    });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard data', 
      error: error.message,
      query: req.body
    });
  }
});

// Get period label based on date and interval
function getPeriodLabel(date, interval) {
  switch (interval) {
    case '15min':
      const minute = date.minute();
      const roundedMinute = Math.floor(minute / 15) * 15;
      return `${date.format('YYYY-MM-DD HH')}:${roundedMinute.toString().padStart(2, '0')}:00`;
    case '30min':
      const minute30 = date.minute();
      const roundedMinute30 = Math.floor(minute30 / 30) * 30;
      return `${date.format('YYYY-MM-DD HH')}:${roundedMinute30.toString().padStart(2, '0')}:00`;
    case 'hourly':
      return date.format('YYYY-MM-DD HH:00:00');
    case 'daily':
      return date.format('YYYY-MM-DD');
    case 'monthly':
      return date.format('YYYY-MM');
    case 'yearly':
      return date.format('YYYY');
    default:
      return date.format('YYYY-MM-DD');
  }
}

// Test connection route
app.get('/api/status', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'ok', 
      message: 'Database connection established',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      } 
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database connection: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

module.exports = app;