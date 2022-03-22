import * as mongoose from 'mongoose';
import config from '../config/env.config';
import mergedObjectType from '../types/mergedObject';

const { mongo } = config;

const mergedObject = new mongoose.Schema<mergedObjectType>(
  {
    aka: { type: [], require: false, default: undefined },
    es: { type: [], require: false, default: undefined },
    sf: { type: [], require: false, default: undefined },
    city: { type: [], require: false, default: undefined },
    adNN: { type: [], require: false, default: undefined },
    mir: { type: [], require: false, default: undefined },

    identifiers: {
      type: {
        personalNumber: String,
        identityCard: String,
        goalUserId: String,
      },
      require: true,
    },

    updatedAt: { type: Date, required: true },
    lock: { type: mongoose.Schema.Types.Number },
  },
  {
    versionKey: false,
  }
);

const mergedObjModel = mongoose.model(mongo.collectionName, mergedObject);

export default mergedObjModel;
