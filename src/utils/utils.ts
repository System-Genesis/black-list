import config from '../config/env.config';
import mergedObj from '../types/mergedObject';

export const getDateFrom = () => {
  return new Date(new Date().setDate(new Date().getDate() - config.daysBefore));
};

export const hasSources = (mergedObj: mergedObj) => {
  return Object.keys(mergedObj).some((r) => Array.isArray(mergedObj[r]) && mergedObj[r].length > 0);
};
