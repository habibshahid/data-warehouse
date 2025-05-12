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
      // Ensure dateColumn is in the columns list if not already
      const selectedColumns = [...columns];
      if (!selectedColumns.includes(dateColumn)) {
        selectedColumns.push(dateColumn);
      }
      query += selectedColumns.join(', ');
    }
    
    // Add FROM clause with the table name
    query += ` FROM ${tableName} WHERE 1=1`;
    
    // Add date range conditions if provided - THIS SECTION NEEDS MODIFICATION
    if (startDate || endDate) {
      // Determine the appropriate date/time column for this table
      let dateColumn;
      let dateFormat;
      
      switch (timeInterval) {
        case '15min':
          dateColumn = 'timeInterval';
          dateFormat = 'YYYY-MM-DD HH:mm:ss';
          break;
        case '30min':
          dateColumn = 'timeInterval';
          dateFormat = 'YYYY-MM-DD HH:mm:ss';
          break;
        case 'hourly':
          dateColumn = 'timeInterval';
          dateFormat = 'YYYY-MM-DD HH:00:00';
          break;
        case 'daily':
          dateColumn = 'timeInterval';
          dateFormat = 'YYYY-MM-DD';
          break;
        case 'monthly':
          dateColumn = 'pKey';
          dateFormat = 'YYYY-MM';
          break;
        case 'yearly':
          dateColumn = 'timeInterval';
          dateFormat = 'YYYY';
          break;
        default:
          dateColumn = 'timeInterval';
          dateFormat = 'YYYY-MM-DD';
      }
      
      // Add start date condition
      if (startDate) {
        const formattedStartDate = moment(startDate).format(dateFormat);
        query += ` AND ${dateColumn} >= '${formattedStartDate}'`;
      }
      
      // Add end date condition
      if (endDate) {
        const formattedEndDate = moment(endDate).format(dateFormat);
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
    
    // Add ORDER BY clause based on time interval
    // Use the same dateColumn we identified for WHERE conditions
    switch (timeInterval) {
      case '15min':
      case '30min':
        query += ` ORDER BY timeInterval`;
        break;
      case 'hourly':
        query += ` ORDER BY timeInterval`;
        break;
      case 'daily':
        query += ` ORDER BY timeInterval`;
        break;
      case 'monthly':
        query += ` ORDER BY pKey`;
        break;
      case 'yearly':
        query += ` ORDER BY timeInterval`;
        break;
      default:
        query += ` ORDER BY timeInterval`;
    }
    
    console.log('Executing query:', query);
    
    // Execute the query
    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });
    
    // Format the period labels based on the interval type
    const results = data.map(row => {
      // Determine the period value based on the time interval
      let periodValue;
      let periodLabel;
      switch (timeInterval) {
        case '15min':
          periodLabel = moment(row[dateColumn]).format('HH:mm');
          break;
        case '30min':
          periodLabel = moment(row[dateColumn]).format('HH:mm');
          //periodValue = row.timeInterval;
          break;
        case 'hourly':
          periodLabel = moment(row[dateColumn]).format('HH:00');
          //periodValue = row.timeInterval;
          break;
        case 'daily':
          periodLabel = moment(row[dateColumn]).format('MMM DD');
          //periodValue = row.timeInterval;
          break;
        case 'monthly':
          periodLabel = moment(row[dateColumn]).format('MMM YYYY');
          //periodValue = row.pKey;
          break;
        case 'yearly':
          periodLabel = row[dateColumn];
          //periodValue = row.timeInterval;
          break;
        default:
          periodLabel = row[dateColumn];
          //periodValue = row.timeInterval;
      }
      
      return {
        ...row,
        period: periodLabel // Use the appropriate period value
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