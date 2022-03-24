import * as mongoose from 'mongoose';
import config from '../config/env.config';
import mergedObjModel from '../mongo/model';
import mergedObj from '../types/mergedObject';

/**
 * Returns all the merged object that contains a record with an expired lastPing.
 * @param date - The final expiration date for lastPing
 * @returns - Stream of the pulled documents
 */
const getExpiredLastPing = (date: Date): mongoose.QueryCursor<mergedObj> => {
  // Create a array of conditions for an $or mongo query
  const cond = config.sources.map((source) => {
    return { [`${source}.lastPing`]: { $lt: date } };
  });

  return mergedObjModel.find({ $or: cond }).lean().cursor();
};

/**
 * Updates the merged object in the db
 * @param updatedObj - The updated merged object
 */
const updateDocument = async (updatedObj: mergedObj): Promise<void> => {
  await mergedObjModel.findOneAndReplace({ _id: updatedObj._id }, updatedObj);
};

// const deleteOne = async (_id: string) => {
//   await mergedObjModel.deleteOne({ _id });
// };

export default { getExpiredLastPing, updateDocument };
