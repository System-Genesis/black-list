import { sendToCreateQueue } from './../rabbit/rabbit';
import { QueryCursor } from 'mongoose';
import repo from '../mongo/repo';
import { sendToSelectorQueue } from '../rabbit/rabbit';
import mergedObj from '../types/mergedObject';
import { record } from '../types/recordType';
import { getDateFrom as expiredDate } from '../utils/utils';
import config from '../config/env.config';
import logs from '../logger/logs';

/**
 * The main function of the daily run.
 */
export const dailyAction = async (): Promise<void> => {
  const streamProvider: QueryCursor<mergedObj> = repo.getExpiredLastPing(expiredDate());
  let count = 0;
  for (let doc = await streamProvider.next(); doc != null; doc = await streamProvider.next()) {
    await handleDelete(doc);
    count += 1;
  }

  logs.DELETE_COUNT(count);
};

/**
 * Handles the delete flow. Finds all the records of the merged object that has to be deleted.
 * Updates in the mongo and sends the relevant information to Selector and CreateRGBE
 * @param mergedObj - The merged object that contains an record with expired lastPing
 */
export async function handleDelete(mergedObj: mergedObj) {
  const recordsToKill: record[] = findAndDeleteExpiredPing(mergedObj);
  await repo.updateDocument(mergedObj);

  sendToSelectorQueue(mergedObj);

  //TODO: Think about moving to findAndDeleteExpiredPing function
  recordsToKill.forEach((record) => sendToCreateQueue(record.userID));
}

/**
 * Deletes the records of the merged object that their last ping is expired. Deleted a source's array if empty after deleting the records
 * @param mergedObj - The current merged object
 * @returns Array of the deleted records
 */
export const findAndDeleteExpiredPing = (mergedObj: mergedObj) => {
  let oldRecords: record[] = [];
  const dateBefore = expiredDate();
  const sourceAbleToDelete = config.sourceAbleToDelete;

  Object.keys(mergedObj).forEach((source) => {
    if (sourceAbleToDelete.includes(source))
      mergedObj[source] = mergedObj[source].filter((rec: { lastPing: Date; record: record }) => {
        if (new Date(rec.lastPing) < dateBefore) {
          oldRecords.push(rec.record);
          logs.DELETED(rec.record.userID, rec.record.source!, mergedObj.identifiers);

          return false;
        }
        return true;
      });

    if (mergedObj[source].length == 0) {
      delete mergedObj[source];
    }
  });

  return oldRecords;
};
