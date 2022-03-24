import * as mongoose from 'mongoose';
import config from '../config/env.config';
import mergedObjModel from '../mongo/model';
import mergedObj from '../types/mergedObject';
import { hasSources } from '../utils/utils';

const getExpiredLastPing = (date: Date): mongoose.QueryCursor<mergedObj> => {
  const cond = config.sources.map((source) => {
    return { [`${source}.lastPing`]: { $lt: date } };
  });

  return mergedObjModel.find({ $or: cond }).lean().cursor();
};

const handleChangedObj = async (updatedObj: mergedObj) => {
  // TODO: Think about deleting the object
  if (hasSources(updatedObj)) {
    await mergedObjModel.findOneAndReplace({ _id: updatedObj._id }, updatedObj);
  } else {
    await mergedObjModel.deleteOne({ _id: updatedObj._id });
  }
};

// const deleteOne = async (_id: string) => {
//   await mergedObjModel.deleteOne({ _id });
// };

export default { getExpiredLastPing, handleChangedObj };
