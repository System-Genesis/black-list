import configEnv from '../config/env.config';
import logger from 'logger-genesis';

/**
 * Initializes the logger
 */
const rabbitEnv = configEnv.rabbit;

export const initializeLogger = async () => {
  await logger.initialize(configEnv.systemName, configEnv.serviceName, rabbitEnv.logQueue, false);
};
