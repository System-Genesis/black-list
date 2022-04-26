import schedule from 'node-schedule';
import config from './config/env.config';
import initializeHttp from './http/app';
import { dailyAction } from './kill';
import { initializeLogger } from './logger/logger';
import logs from './logger/logs';
import initializeMongo from './mongo/initializeMongo';
import { initializeRabbit } from './rabbit/rabbit';

(async () => {
  initializeHttp();
  await initializeRabbit();
  await initializeLogger();
  await initializeMongo();

  dailyAction();

  schedule.scheduleJob({ hour: config.hourSchedule }, () => {
    logs.DAILY_START();
    dailyAction();
  });
})();
