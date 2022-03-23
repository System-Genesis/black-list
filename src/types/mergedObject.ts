type mergedObject = {
  _id?: string;
  aka?: any[];
  es_name?: any[];
  sf_name?: any[];
  city_name?: any[];
  adNN_name?: any[];
  mir_name?: any[];

  identifiers: {
    personalNumber?: string;
    identityCard?: string;
    goalUserId?: string;
  };

  updatedAt: Date;
};

export default mergedObject;
