// server/utils/advancedFilterParser.js

/**
 * Server-side parser for advanced filters sent from the client
 * This utility helps convert the JSON filter structure to SQL WHERE clauses
 */
const moment = require('moment');

/**
 * Parse advanced filters and convert to SQL WHERE clause
 * @param {Object} advancedFilters - The advanced filters from client
 * @returns {string} - SQL WHERE clause (without the "WHERE" keyword)
 */
const parseAdvancedFilters = (advancedFilters) => {
  if (!advancedFilters || 
      (!advancedFilters.conditions || advancedFilters.conditions.length === 0) && 
      (!advancedFilters.groups || advancedFilters.groups.length === 0)) {
    return '';
  }
  
  // If we have a pre-built SQL query, use it (for simpler cases)
  if (advancedFilters.sqlQuery) {
    // Important security check: only allow certain SQL operations to prevent injection
    // This is a basic implementation - a more robust approach would use parameterized queries
    const safeQuery = sanitizeSqlQuery(advancedFilters.sqlQuery);
    return safeQuery;
  }
  
  // Otherwise, build the SQL from conditions and groups
  const conditions = [];
  
  // Add regular conditions
  if (advancedFilters.conditions && advancedFilters.conditions.length > 0) {
    advancedFilters.conditions.forEach((condition, index) => {
      if (!condition.field || !condition.operator) return;
      
      const conditionSql = buildConditionSql(condition, index === 0);
      if (conditionSql) {
        conditions.push(conditionSql);
      }
    });
  }
  
  // Add condition groups
  if (advancedFilters.groups && advancedFilters.groups.length > 0) {
    advancedFilters.groups.forEach((group, index) => {
      if (!group.conditions || group.conditions.length === 0) return;
      
      const isFirst = index === 0 && conditions.length === 0;
      const groupSql = buildGroupSql(group, isFirst);
      if (groupSql) {
        conditions.push(groupSql);
      }
    });
  }
  
  return conditions.join(' ');
};

/**
 * Build SQL for a single condition
 * @param {Object} condition - The condition object
 * @param {boolean} isFirst - Whether this is the first condition
 * @returns {string} - SQL for the condition
 */
const buildConditionSql = (condition, isFirst) => {
  const { field, operator, value, logicalOperator = 'AND', isNot = false } = condition;
  
  // Safety check for field name
  if (!isValidFieldName(field)) {
    console.warn(`Invalid field name in condition: ${field}`);
    return '';
  }
  
  let conditionSql = '';
  
  // Add logical operator for non-first conditions
  if (!isFirst) {
    conditionSql += ` ${logicalOperator} `;
  }
  
  // Handle NOT conditions
  if (isNot) {
    conditionSql += 'NOT ';
  }
  
  // Handle various operator types
  switch (operator) {
    case 'IS NULL':
      conditionSql += `${field} IS NULL`;
      break;
      
    case 'IS NOT NULL':
      conditionSql += `${field} IS NOT NULL`;
      break;
      
    case 'BETWEEN':
      if (Array.isArray(value) && value.length === 2) {
        const formattedStart = formatValue(value[0]);
        const formattedEnd = formatValue(value[1]);
        conditionSql += `${field} BETWEEN ${formattedStart} AND ${formattedEnd}`;
      } else {
        return ''; // Invalid BETWEEN condition
      }
      break;
      
    case 'NOT BETWEEN':
      if (Array.isArray(value) && value.length === 2) {
        const formattedStart = formatValue(value[0]);
        const formattedEnd = formatValue(value[1]);
        conditionSql += `${field} NOT BETWEEN ${formattedStart} AND ${formattedEnd}`;
      } else {
        return ''; // Invalid NOT BETWEEN condition
      }
      break;
      
    case 'LIKE':
      conditionSql += `${field} LIKE ${formatValue(`%${value}%`)}`;
      break;
      
    case 'NOT LIKE':
      conditionSql += `${field} NOT LIKE ${formatValue(`%${value}%`)}`;
      break;
      
    case 'LIKE%':
      conditionSql += `${field} LIKE ${formatValue(`${value}%`)}`;
      break;
      
    case '%LIKE':
      conditionSql += `${field} LIKE ${formatValue(`%${value}`)}`;
      break;
      
    case '=true':
      conditionSql += `${field} = 1`;
      break;
      
    case '=false':
      conditionSql += `${field} = 0`;
      break;
      
    default:
      // Standard operators
      conditionSql += `${field} ${operator} ${formatValue(value)}`;
  }
  
  return conditionSql;
};

/**
 * Build SQL for a condition group
 * @param {Object} group - The condition group
 * @param {boolean} isFirst - Whether this is the first group
 * @returns {string} - SQL for the group
 */
const buildGroupSql = (group, isFirst) => {
  if (!group.conditions || group.conditions.length === 0) return '';
  
  let groupSql = '';
  
  // Add logical operator for non-first groups
  if (!isFirst) {
    groupSql += ` ${group.logicalOperator || 'AND'} `;
  }
  
  // Start group with parenthesis
  groupSql += '(';
  
  // Add each condition in the group
  group.conditions.forEach((condition, index) => {
    if (!condition.field || !condition.operator) return;
    
    const conditionSql = buildConditionSql(condition, index === 0);
    if (conditionSql) {
      groupSql += conditionSql;
    }
  });
  
  // Close group with parenthesis
  groupSql += ')';
  
  return groupSql;
};

/**
 * Format a value for SQL based on its type
 * @param {any} value - The value to format
 * @returns {string} - Formatted value for SQL
 */
const formatValue = (value) => {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return `'${moment(value).format('YYYY-MM-DD HH:mm:ss')}'`;
  }
  
  // Escape single quotes and return as string
  return `'${value.toString().replace(/'/g, "''")}'`;
};

/**
 * Validate a field name to prevent SQL injection
 * @param {string} fieldName - The field name to validate
 * @returns {boolean} - Whether the field name is valid
 */
const isValidFieldName = (fieldName) => {
  // Only allow alphanumeric characters, underscores, and specific symbols
  const validFieldNameRegex = /^[a-zA-Z0-9_\.]+$/;
  return validFieldNameRegex.test(fieldName);
};

/**
 * Sanitize a SQL query to prevent injection
 * @param {string} sqlQuery - The SQL query to sanitize
 * @returns {string} - Sanitized SQL query
 */
const sanitizeSqlQuery = (sqlQuery) => {
  // This is a very basic implementation
  // A more robust approach would use parameterized queries
  
  // Remove any SQL commands that could be dangerous
  const blacklist = [
    'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE',
    'UNION', '--', '/*', '*/', 'EXEC', 'EXECUTE', 'TRANSACTION', 'COMMIT',
    'ROLLBACK', 'SAVEPOINT', 'GRANT', 'REVOKE'
  ];
  
  let sanitized = sqlQuery;
  
  // Check for blacklisted terms
  blacklist.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(sanitized)) {
      throw new Error(`SQL injection attempt detected: ${term}`);
    }
  });
  
  return sanitized;
};

module.exports = {
  parseAdvancedFilters
};