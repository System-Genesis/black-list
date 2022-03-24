import config from '../config/env.config';
// import mergedObj from '../types/mergedObject';

/**
 * Calculate and return a Date from days number from the config
 * @returns A Date showing the date of days number from the config days ago
 */
export const getDateFrom = () => {
  return new Date(new Date().setDate(new Date().getDate() - config.daysBefore));
};

// export const hasSources = (mergedObj: mergedObj) => {
//   return Object.keys(mergedObj).some((r) => Array.isArray(mergedObj[r]) && mergedObj[r].length > 0);
// };
