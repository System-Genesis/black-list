import logger from 'logger-genesis';

const DAILY_START = () => logger.info(true, 'SYSTEM', 'Daily run', `Starts Daily run`);

const DELETE_COUNT = (count: number) =>
  logger.info(true, 'APP', 'Delete finished successfully', `deleted ${count} records`, count);

const DELETED = (
  userId: string,
  source: string,
  identifiers: { personalNumber?: string; identityCard?: string; goalUserId?: string }
) =>
  logger.info(
    true,
    'APP',
    'Record in merged object deleted',
    `The record with userID: ${userId} from source: ${source} deleted from entity with identifier ${
      identifiers.personalNumber || identifiers.identityCard || identifiers.goalUserId
    }`,
    { identifiers: identifiers }
  );

const SEND_TO_QUEUE = (queueName: string, msg: string, data: object) => {
  logger.info(false, 'APP', `Sending object to ${queueName} queue`, `${msg} ${JSON.stringify(data)}`);
};
export default {
  DAILY_START,
  DELETE_COUNT,
  DELETED,
  SEND_TO_QUEUE,
};
