// Utils to convert UI conditions to SQL Query
// server/utils/sql-builder.js

/**
 * Convert UI query builder conditions to SQL WHERE clause
 * @param {Object} conditions - The conditions object from the query builder
 * @returns {String} SQL WHERE clause (without the "WHERE" keyword)
 */
const buildSqlWhereClause = (conditions) => {
  if (!conditions) {
    return '1=1'; // Default to true condition
  }
  
  return buildCondition(conditions);
};

/**
 * Recursively build SQL condition from condition object
 * @param {Object} condition - Condition or group of conditions
 * @returns {String} SQL condition
 */
const buildCondition = (condition) => {
  if (!condition || !condition.type) {
    return '1=1';
  }
  
  if (condition.type === 'condition') {
    // Basic condition
    const { field, operator, value } = condition;
    
    // Handle null operators
    if (operator === 'IS NULL') {
      return `${escapeField(field)} IS NULL`;
    }
    
    if (operator === 'IS NOT NULL') {
      return `${escapeField(field)} IS NOT NULL`;
    }
    
    // Handle IN operators
    if (operator === 'IN' || operator === 'NOT IN') {
      const values = Array.isArray(value) ? value : value.split(',').map(v => v.trim());
      const formattedValues = values.map(v => formatValue(v));
      return `${escapeField(field)} ${operator} (${formattedValues.join(', ')})`;
    }
    
    // Handle LIKE operators
    if (operator === 'LIKE' || operator === 'NOT LIKE') {
      return `${escapeField(field)} ${operator} ${formatValue(value)}`;
    }
    
    // Handle regular operators
    return `${escapeField(field)} ${operator} ${formatValue(value)}`;
  }
  
  if (condition.type === 'group') {
    // Group of conditions
    if (!condition.conditions || condition.conditions.length === 0) {
      return '1=1';
    }
    
    const subConditions = condition.conditions
      .map(buildCondition)
      .filter(Boolean);
    
    if (subConditions.length === 0) {
      return '1=1';
    }
    
    if (subConditions.length === 1) {
      return subConditions[0];
    }
    
    return `(${subConditions.join(` ${condition.operator} `)})`;
  }
  
  return '1=1';
};

/**
 * Escape SQL field names to prevent SQL injection
 * @param {String} field - Field name
 * @returns {String} Escaped field name
 */
const escapeField = (field) => {
  // Basic field name escaping (backticks for MySQL)
  if (!field) return '1';
  
  // Only allow alphanumeric characters, underscore, and dot for table.field syntax
  if (!/^[a-zA-Z0-9_.]+$/.test(field)) {
    return '1'; // Return safe default if field name contains invalid characters
  }
  
  // If field contains dot (table.field), escape both parts
  if (field.includes('.')) {
    const [table, column] = field.split('.');
    return `\`${table}\`.\`${column}\``;
  }
  
  return `\`${field}\``;
};

/**
 * Format value based on its type
 * @param {*} value - Value to format
 * @returns {String} Formatted value for SQL
 */
const formatValue = (value) => {
  if (value === undefined || value === null) {
    return 'NULL';
  }
  
  // Check if it's a number
  if (!isNaN(value) && value.toString().trim() !== '') {
    return value;
  }
  
  // Escape string value
  return `'${escapeString(value)}'`;
};

/**
 * Escape string value to prevent SQL injection
 * @param {String} str - String to escape
 * @returns {String} Escaped string
 */
const escapeString = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  
  // Basic string escaping for SQL
  return str.replace(/[\0\n\r\b\t\\'"\x1a]/g, (s) => {
    switch (s) {
      case '\0': return '\\0';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '\b': return '\\b';
      case '\t': return '\\t';
      case '\x1a': return '\\Z';
      case '\'': return '\\\'';
      case '"': return '\\"';
      case '\\': return '\\\\';
      default: return s;
    }
  });
};

module.exports = {
  buildSqlWhereClause,
  escapeField,
  formatValue,
  escapeString
};