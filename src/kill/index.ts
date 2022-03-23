import { sendToCreateQueue } from './../rabbit/rabbit';
import logger from 'logger-genesis';
import { QueryCursor } from 'mongoose';
import repo from '../mongo/repo';
import { sendToSelectorQueue } from '../rabbit/rabbit';
import mergedObj from '../types/mergedObject';
import { record } from '../types/recordType';
import { getDateFrom as expiredDate } from '../utils/utils';

export const dailyAction = async (): Promise<void> => {
  const streamProvider: QueryCursor<mergedObj> = repo.getExpiredLastPing(expiredDate());
  let count = 0;
  for (let doc = await streamProvider.next(); doc != null; doc = await streamProvider.next()) {
    handleDelete(doc);
    count += 1;
  }

  logger.info(true, 'APP', 'Delete finished successfully', `deleted ${count} records`, count);
};

export async function handleDelete(mergedObj: mergedObj) {
  const recordsToKill: record[] = findAndDeleteExpiredPing(mergedObj);
  await repo.handleChangedObj(mergedObj);

  sendToSelectorQueue(mergedObj);
  for (let i = 0; i < recordsToKill.length; i++) {
    if (recordsToKill[i].userID) {
      sendToCreateQueue(recordsToKill[i].userID!);
    }
  }
}

/**
 * Deletes the records of the merged object that their last ping is expired. Deleted a source's array if empty after deleting the records
 * @param mergedObj - The current merged object
 * @returns Array of the deleted records
 */
export const findAndDeleteExpiredPing = (mergedObj: mergedObj) => {
  let oldRecords: record[] = [];
  const dateBefore = expiredDate();

  Object.keys(mergedObj).forEach((source) => {
    if (source !== 'identifiers' && source !== '_id' && Array.isArray(mergedObj[source]))
      mergedObj[source] = mergedObj[source].filter((rec: { lastPing: Date; record: record }) => {
        if (new Date(rec.lastPing) < dateBefore) {
          oldRecords.push(rec.record);
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
