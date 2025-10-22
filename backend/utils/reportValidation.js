/**
 * Helper function to validate date parameters
 */
export const validateDates = (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new Error('Start date and end date are required');
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }
  
  if (start > end) {
    throw new Error('Start date must be before end date');
  }
  
  return { start, end };
};

/**
 * Helper function to validate quarter and year
 */
export const validateQuarterYear = (quarter, year) => {
  const quarterNum = parseInt(quarter);
  const yearNum = parseInt(year);
  
  if (isNaN(quarterNum) || quarterNum < 1 || quarterNum > 4) {
    throw new Error('Invalid quarter (must be 1-4)');
  }
  
  if (isNaN(yearNum) || yearNum < 2000) {
    throw new Error('Invalid year');
  }
  
  return { quarterNum, yearNum };
};

/**
 * Helper function to format date for SQL
 */
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Note: functions are exported above as named exports to be imported by services