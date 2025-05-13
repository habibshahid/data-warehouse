// src/utils/queryBuilder.js

/**
 * Enhanced SQL Query Builder with support for advanced conditions
 */
export class SQLQueryBuilder {
  constructor() {
    this.select = '*';
    this.from = '';
    this.whereConditions = [];
    this.groupByColumns = [];
    this.orderByColumns = [];
    this.limitValue = null;
    this.offsetValue = null;
    this.conditionGroups = [];
  }

  /**
   * Set the columns to select
   * @param {string|array} columns - Columns to select
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  selectColumns(columns) {
    if (Array.isArray(columns) && columns.length > 0) {
      this.select = columns.join(', ');
    } else if (typeof columns === 'string' && columns.trim() !== '') {
      this.select = columns;
    }
    return this;
  }

  /**
   * Set the table to query from
   * @param {string} table - Table name
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  fromTable(table) {
    this.from = table;
    return this;
  }

  /**
   * Add a simple where condition
   * @param {string} column - Column name
   * @param {string} operator - Comparison operator (=, >, <, etc.)
   * @param {any} value - Value to compare against
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  where(column, operator, value, logicalOperator = 'AND') {
    const formattedValue = this._formatValue(value);
    this.whereConditions.push({
      column,
      operator,
      value: formattedValue,
      logicalOperator,
      isNot: false,
      groupId: null
    });
    return this;
  }

  /**
   * Add a NOT condition
   * @param {string} column - Column name
   * @param {string} operator - Comparison operator (=, >, <, etc.)
   * @param {any} value - Value to compare against
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  whereNot(column, operator, value, logicalOperator = 'AND') {
    const formattedValue = this._formatValue(value);
    this.whereConditions.push({
      column,
      operator,
      value: formattedValue,
      logicalOperator,
      isNot: true,
      groupId: null
    });
    return this;
  }

  /**
   * Start a new condition group
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @returns {number} - Group ID for reference
   */
  startGroup(logicalOperator = 'AND') {
    const groupId = this.conditionGroups.length;
    this.conditionGroups.push({
      id: groupId,
      logicalOperator,
      conditions: []
    });
    return groupId;
  }

  /**
   * Add a condition to a specific group
   * @param {number} groupId - Group ID
   * @param {string} column - Column name
   * @param {string} operator - Comparison operator (=, >, <, etc.)
   * @param {any} value - Value to compare against
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @param {boolean} isNot - Whether this is a NOT condition (default: false)
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  whereGroup(groupId, column, operator, value, logicalOperator = 'AND', isNot = false) {
    if (groupId < 0 || groupId >= this.conditionGroups.length) {
      throw new Error(`Group with ID ${groupId} does not exist.`);
    }

    const formattedValue = this._formatValue(value);
    this.conditionGroups[groupId].conditions.push({
      column,
      operator,
      value: formattedValue,
      logicalOperator,
      isNot
    });
    
    return this;
  }

  /**
   * Add a WHERE IN condition
   * @param {string} column - Column name
   * @param {array} values - Array of values
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @param {boolean} isNot - Whether to use NOT IN instead of IN
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  whereIn(column, values, logicalOperator = 'AND', isNot = false) {
    if (!Array.isArray(values) || values.length === 0) {
      return this;
    }

    const formattedValues = values.map(value => this._formatValue(value)).join(', ');
    const operator = isNot ? 'NOT IN' : 'IN';

    this.whereConditions.push({
      column,
      operator,
      value: `(${formattedValues})`,
      logicalOperator,
      isNot: false, // Already handled in the operator
      groupId: null
    });

    return this;
  }

  /**
   * Add a WHERE NOT IN condition
   * @param {string} column - Column name
   * @param {array} values - Array of values
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  whereNotIn(column, values, logicalOperator = 'AND') {
    return this.whereIn(column, values, logicalOperator, true);
  }

  /**
   * Add a BETWEEN condition
   * @param {string} column - Column name
   * @param {any} start - Start value
   * @param {any} end - End value
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @param {boolean} isNot - Whether to use NOT BETWEEN
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  whereBetween(column, start, end, logicalOperator = 'AND', isNot = false) {
    const startFormatted = this._formatValue(start);
    const endFormatted = this._formatValue(end);
    const operator = isNot ? 'NOT BETWEEN' : 'BETWEEN';

    this.whereConditions.push({
      column,
      operator,
      value: `${startFormatted} AND ${endFormatted}`,
      logicalOperator,
      isNot: false, // Already handled in the operator
      groupId: null
    });

    return this;
  }

  /**
   * Add a NOT BETWEEN condition
   * @param {string} column - Column name
   * @param {any} start - Start value
   * @param {any} end - End value
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  whereNotBetween(column, start, end, logicalOperator = 'AND') {
    return this.whereBetween(column, start, end, logicalOperator, true);
  }

  /**
   * Add NULL check condition
   * @param {string} column - Column name
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @param {boolean} isNot - Whether to check for NOT NULL
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  whereNull(column, logicalOperator = 'AND', isNot = false) {
    const operator = isNot ? 'IS NOT NULL' : 'IS NULL';

    this.whereConditions.push({
      column,
      operator,
      value: '',
      logicalOperator,
      isNot: false, // Already handled in the operator
      groupId: null
    });

    return this;
  }

  /**
   * Add NOT NULL check condition
   * @param {string} column - Column name
   * @param {string} logicalOperator - AND or OR (default: AND)
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  whereNotNull(column, logicalOperator = 'AND') {
    return this.whereNull(column, logicalOperator, true);
  }

  /**
   * Add a GROUP BY clause
   * @param {string|array} columns - Columns to group by
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  groupBy(columns) {
    if (Array.isArray(columns)) {
      this.groupByColumns = [...this.groupByColumns, ...columns];
    } else if (typeof columns === 'string') {
      this.groupByColumns.push(columns);
    }
    return this;
  }

  /**
   * Add an ORDER BY clause
   * @param {string} column - Column to order by
   * @param {string} direction - ASC or DESC (default: ASC)
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  orderBy(column, direction = 'ASC') {
    this.orderByColumns.push({ column, direction: direction.toUpperCase() });
    return this;
  }

  /**
   * Add a LIMIT clause
   * @param {number} limit - Limit value
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  limit(limit) {
    this.limitValue = parseInt(limit, 10);
    return this;
  }

  /**
   * Add an OFFSET clause
   * @param {number} offset - Offset value
   * @returns {SQLQueryBuilder} - Returns this for chaining
   */
  offset(offset) {
    this.offsetValue = parseInt(offset, 10);
    return this;
  }

  /**
   * Build and return the complete SQL query
   * @returns {string} - The SQL query string
   */
  build() {
    if (!this.from) {
      throw new Error('No table specified. Use fromTable() to specify a table.');
    }

    let query = `SELECT ${this.select} FROM ${this.from}`;

    // Add WHERE clause with all conditions
    const whereClause = this._buildWhereClause();
    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }

    // Add GROUP BY clause
    if (this.groupByColumns.length > 0) {
      query += ` GROUP BY ${this.groupByColumns.join(', ')}`;
    }

    // Add ORDER BY clause
    if (this.orderByColumns.length > 0) {
      const orderByParts = this.orderByColumns.map(
        item => `${item.column} ${item.direction}`
      );
      query += ` ORDER BY ${orderByParts.join(', ')}`;
    }

    // Add LIMIT clause
    if (this.limitValue !== null) {
      query += ` LIMIT ${this.limitValue}`;
    }

    // Add OFFSET clause
    if (this.offsetValue !== null) {
      query += ` OFFSET ${this.offsetValue}`;
    }

    return query;
  }

  /**
   * Helper to build the WHERE clause
   * @returns {string} - The WHERE clause without the "WHERE" keyword
   * @private
   */
  _buildWhereClause() {
    const conditions = [];

    // Add regular conditions
    for (let i = 0; i < this.whereConditions.length; i++) {
      const condition = this.whereConditions[i];
      
      let conditionStr = '';
      
      // First condition doesn't need a logical operator
      if (i > 0) {
        conditionStr += ` ${condition.logicalOperator} `;
      }
      
      // Handle NOT conditions
      if (condition.isNot) {
        conditionStr += 'NOT ';
      }
      
      // Special handling for IS NULL and IS NOT NULL
      if (condition.operator === 'IS NULL' || condition.operator === 'IS NOT NULL') {
        conditionStr += `${condition.column} ${condition.operator}`;
      } else {
        conditionStr += `${condition.column} ${condition.operator} ${condition.value}`;
      }
      
      conditions.push(conditionStr);
    }

    // Add group conditions
    for (let i = 0; i < this.conditionGroups.length; i++) {
      const group = this.conditionGroups[i];
      
      if (group.conditions.length === 0) {
        continue;
      }
      
      let groupStr = '';
      
      // First group doesn't need a logical operator if no other conditions exist
      if (i > 0 || conditions.length > 0) {
        groupStr += ` ${group.logicalOperator} `;
      }
      
      groupStr += '(';
      
      // Build the group's conditions
      for (let j = 0; j < group.conditions.length; j++) {
        const condition = group.conditions[j];
        
        // First condition in group doesn't need a logical operator
        if (j > 0) {
          groupStr += ` ${condition.logicalOperator} `;
        }
        
        // Handle NOT conditions
        if (condition.isNot) {
          groupStr += 'NOT ';
        }
        
        // Special handling for IS NULL and IS NOT NULL
        if (condition.operator === 'IS NULL' || condition.operator === 'IS NOT NULL') {
          groupStr += `${condition.column} ${condition.operator}`;
        } else {
          groupStr += `${condition.column} ${condition.operator} ${condition.value}`;
        }
      }
      
      groupStr += ')';
      conditions.push(groupStr);
    }

    return conditions.join('');
  }

  /**
   * Helper to format values for SQL
   * @param {any} value - The value to format
   * @returns {string} - The formatted value
   * @private
   */
  _formatValue(value) {
    if (value === null) {
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
      return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
    }

    // Escape single quotes
    return `'${value.toString().replace(/'/g, "''")}'`;
  }
}

/**
 * Create and return a new SQLQueryBuilder instance
 * @returns {SQLQueryBuilder} - New query builder instance
 */
export const createQueryBuilder = () => {
  return new SQLQueryBuilder();
};

export default createQueryBuilder;