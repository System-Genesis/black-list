import mongoose from 'mongoose';
import logger from 'logger-genesis';
import config from '../config/env.config';

const { mongo } = config;

export default async () => {
  logger.info(false, 'SYSTEM', 'Connecting to Mongo', 'Connecting to Mongo');

  await mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true });

  logger.info(false, 'SYSTEM', 'Mongo connection established', 'Mongo connection established');
};
