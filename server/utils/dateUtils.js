const moment = require('moment');

/**
 * Formats a date to YYYY-MM-DD
 */
const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

/**
 * Validates if a date string is in a proper format
 */
const isValidDate = (dateString) => {
  return moment(dateString, 'YYYY-MM-DD', true).isValid();
};

module.exports = {
  formatDate,
  isValidDate
};