import mongoose from 'mongoose';
import config from '../config/env.config';

const { mongo } = config;

/**
 * Initializes the connection to mongo via mongoose
 */
export default async () => {
  console.log('Connecting to Mongo');

  await mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true });

  console.log('Mongo connection established');
};
