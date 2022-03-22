import './dotenv';

import * as env from 'env-var';

export default {
  mongo: {
    uri: env.get('MONGO_URI').required().asString(),
    collectionName: env.get('COLLECTION_NAME').required().asString(),
  },
  rabbit: {
    uri: env.get('RABBIT_URI').required().asUrlString(),
    retryOptions: {
      minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
      retries: env.get('RABBIT_RETRY_RETRIES').default(10).asIntPositive(),
      factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
    },
    selectorQueue: env.get('SELECTOR_QUEUE').required().asString(),
    createQueue: env.get('CREATE_QUEUE').required().asString(),
    logQueue: env.get('LOG_QUEUE').required().asString(),
  },
  systemName: env.get('SYSTEM_NAME').required().asString(),
  serviceName: env.get('SERVICE_NAME').required().asString(),
  daysBefore: env.get('DAYS_BEFORE').required().asInt(),
  hourSchedule: env.get('HOUR_SCHEDULE').required().asInt(),
  sources: env.get('SOURCES').required().asArray(),
};
