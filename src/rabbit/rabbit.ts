import logger from 'logger-genesis';
import menash from 'menashmq';
import config from '../config/env.config';
import logs from '../logger/logs';
import mergedObjectType from '../types/mergedObject';

/**
 * Initialized the connection to rabbit, declares the queues
 */
export const initializeRabbit = async () => {
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

/**
 * Sends the given merged object to Selector
 * @param mergedObject - The updated merged object
 */
export const sendToSelectorQueue = (mergedObject: mergedObjectType): void => {
  logs.SEND_TO_QUEUE('SELECTOR', `Sending merged object to selector with identifiers`, mergedObject.identifiers);

  menash.send(config.rabbit.selectorQueue, mergedObject, { persistent: true });
};

/**
 * Sends to CreateRGBE a uniqueID of a DI to delete
 * @param userId - The uniqueID for the DI that has to be deleted
 */
export const sendToCreateQueue = (userId: string): void => {
  logs.SEND_TO_QUEUE('create', `Sending DI to create to delete with 'uniqueId' `, { userId });

  menash.send(config.rabbit.createQueue, userId, { persistent: true });
};

export default { initializeRabbit };
