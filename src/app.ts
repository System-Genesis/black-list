import logger from 'logger-genesis';
import schedule from 'node-schedule';
import config from './config/env.config';
import { dailyAction } from './kill';
import { initializeLogger } from './logger/logger';
import initializeMongo from './mongo/initializeMongo';
import { connectRabbit } from './rabbit/rabbit';

(async () => {
  await connectRabbit();
  await initializeLogger();
  await initializeMongo();
  dailyAction();
  schedule.scheduleJob({ hour: config.hourSchedule }, () => {
    logger.info(true, 'SYSTEM', 'Daily run', `start Daily run`);
    dailyAction();
  });
})();
