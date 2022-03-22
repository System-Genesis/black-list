import logger from 'logger-genesis';
import menash from 'menashmq';
import config from '../config/env.config';
import logObject from '../types/log';
import mergedObjectType from '../types/mergedObject';

export const connectRabbit = async () => {
  try {
    console.log('Try connect to Rabbit');

    await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

    await menash.declareQueue(config.rabbit.selectorQueue, { durable: true });
    await menash.declareQueue(config.rabbit.createQueue, { durable: true });

    console.log('Rabbit connected');
  } catch (error: any) {
    console.log('Unknown Error, on Connect Rabbit', error.message);
  }
};

export const sendToLogQueue = (logToSend: logObject): void => {
  menash.send(config.rabbit.logQueue, logToSend, { persistent: true });
};

export const sendToSelectorQueue = (mergedObject: mergedObjectType): void => {
  logger.info(
    false,
    'APP',
    'Sending object to selector queue',
    `Sending merged object to selector with identifiers${JSON.stringify(mergedObject.identifiers)}`
  );
  menash.send(config.rabbit.selectorQueue, mergedObject, { persistent: true });
};

export const sendToCreateQueue = (userId: string): void => {
  logger.info(
    false,
    'APP',
    'Sending DI to create queue for delete',
    `Sending DI to create to delete with uniqueId ${userId}`
  );
  menash.send(config.rabbit.createQueue, { userId }, { persistent: true });
};

export default { connectRabbit };
