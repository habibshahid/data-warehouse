import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);

// Default timezone - can be configured in settings
export const DEFAULT_TIMEZONE = 'UTC';

// Format date for display
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

// Format date and time for display
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

// Get start of period based on interval type
export const getStartOfPeriod = (date, interval) => {
  const d = dayjs(date);
  
  switch (interval) {
    case '15min':
      // Round to nearest 15 minutes
      const minute = d.minute();
      const roundedMinute = Math.floor(minute / 15) * 15;
      return d.minute(roundedMinute).second(0).millisecond(0);
    case '30min':
      // Round to nearest 30 minutes
      const minute30 = d.minute();
      const roundedMinute30 = Math.floor(minute30 / 30) * 30;
      return d.minute(roundedMinute30).second(0).millisecond(0);
    case 'hourly':
      return d.minute(0).second(0).millisecond(0);
    case 'daily':
      return d.hour(0).minute(0).second(0).millisecond(0);
    case 'weekly':
      return d.day(0).hour(0).minute(0).second(0).millisecond(0);
    case 'monthly':
      return d.date(1).hour(0).minute(0).second(0).millisecond(0);
    case 'yearly':
      return d.month(0).date(1).hour(0).minute(0).second(0).millisecond(0);
    default:
      return d;
  }
};

// Get relative date ranges
export const getRelativeDateRange = (range) => {
  const now = dayjs();
  
  switch (range) {
    case 'today':
      return [
        getStartOfPeriod(now, 'daily').toDate(),
        now.toDate(),
      ];
    case 'yesterday':
      const yesterday = now.subtract(1, 'day');
      return [
        getStartOfPeriod(yesterday, 'daily').toDate(),
        yesterday.hour(23).minute(59).second(59).toDate(),
      ];
    case 'thisWeek':
      return [
        getStartOfPeriod(now, 'weekly').toDate(),
        now.toDate(),
      ];
    case 'lastWeek':
      const lastWeek = now.subtract(1, 'week');
      return [
        getStartOfPeriod(lastWeek, 'weekly').toDate(),
        lastWeek.day(6).hour(23).minute(59).second(59).toDate(),
      ];
    case 'thisMonth':
      return [
        getStartOfPeriod(now, 'monthly').toDate(),
        now.toDate(),
      ];
    case 'lastMonth':
      const lastMonth = now.subtract(1, 'month');
      return [
        getStartOfPeriod(lastMonth, 'monthly').toDate(),
        lastMonth.date(lastMonth.daysInMonth()).hour(23).minute(59).second(59).toDate(),
      ];
    case 'last7Days':
      return [
        now.subtract(6, 'day').startOf('day').toDate(),
        now.toDate(),
      ];
    case 'last30Days':
      return [
        now.subtract(29, 'day').startOf('day').toDate(),
        now.toDate(),
      ];
    default:
      return [null, null];
  }
};