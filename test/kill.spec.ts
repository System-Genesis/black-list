import { findAndDeleteExpiredPing } from '../src/kill';
import mergedObject from '../src/types/mergedObject';
import { record } from '../src/types/recordType';

jest.mock('logger-genesis');

const dateFromDaysNumber = (days: number): Date => {
  return new Date(new Date().setDate(new Date().getDate() - days));
};

const validLastPing = dateFromDaysNumber(2);
const expiredLastPing = dateFromDaysNumber(40);

describe('findAndDeleteExpiredPing', () => {
  test('Remove source', () => {
    const mergedObj: mergedObject = {
      aka: [{ record: { userID: 'lol' }, lastPing: validLastPing }],
      es_name: [{ record: { userID: 'lol1' }, lastPing: expiredLastPing }],
      _id: '',
      identifiers: {
        personalNumber: '',
        identityCard: '',
        goalUserId: '',
      },
      updatedAt: validLastPing,
    };

    const DIsToDelete: record[] = findAndDeleteExpiredPing(mergedObj);

    const expectedDIsToDelete: record[] = [{ userID: 'lol1' }];
    const expectedMergedObject: mergedObject = {
      aka: [{ record: { userID: 'lol' }, lastPing: validLastPing }],
      identifiers: {
        personalNumber: '',
        identityCard: '',
        goalUserId: '',
      },
      updatedAt: validLastPing,
    };

    expect(mergedObj).toEqual(expectedMergedObject);
    expect(DIsToDelete).toEqual(expectedDIsToDelete);
  });

  test('Remove source and a record from source array', () => {
    const mergedObj: mergedObject = {
      aka: [{ record: { userID: 'lol' }, lastPing: expiredLastPing }],
      es_name: [
        { record: { userID: 'lol1' }, lastPing: expiredLastPing },
        { record: { userID: 'lol2' }, lastPing: validLastPing },
      ],
      identifiers: {
        personalNumber: '',
        identityCard: '',
        goalUserId: '',
      },
      updatedAt: validLastPing,
    };

    const DIsToDelete: record[] = findAndDeleteExpiredPing(mergedObj);

    const expectedDIsToDelete: record[] = [{ userID: 'lol' }, { userID: 'lol1' }];
    const expectedMergedObject: mergedObject = {
      es_name: [{ record: { userID: 'lol2' }, lastPing: validLastPing }],
      identifiers: {
        personalNumber: '',
        identityCard: '',
        goalUserId: '',
      },
      updatedAt: validLastPing,
    };

    expect(mergedObj).toEqual(expectedMergedObject);
    expect(DIsToDelete).toEqual(expectedDIsToDelete);
  });

  test('Delete all records', () => {
    const mergedObj: mergedObject = {
      aka: [{ record: { userID: 'lol' }, lastPing: expiredLastPing }],
      es_name: [
        { record: { userID: 'lol1' }, lastPing: expiredLastPing },
        { record: { userID: 'lol2' }, lastPing: expiredLastPing },
      ],
      identifiers: {
        personalNumber: '',
        identityCard: '',
        goalUserId: '',
      },
      updatedAt: validLastPing,
    };

    const DIsToDelete: record[] = findAndDeleteExpiredPing(mergedObj);

    const expectedDIsToDelete: record[] = [{ userID: 'lol' }, { userID: 'lol1' }, { userID: 'lol2' }];
    const expectedMergedObject: mergedObject = {
      identifiers: {
        personalNumber: '',
        identityCard: '',
        goalUserId: '',
      },
      updatedAt: validLastPing,
    };

    expect(mergedObj).toEqual(expectedMergedObject);
    expect(DIsToDelete).toEqual(expectedDIsToDelete);
  });

  test('No record needs to be deleted', () => {
    const mergedObj: mergedObject = {
      aka: [{ record: { userID: 'lol' }, lastPing: validLastPing }],
      es_name: [
        { record: { userID: 'lol' }, lastPing: validLastPing },
        { record: { userID: 'lol' }, lastPing: validLastPing },
      ],
      identifiers: {
        personalNumber: '',
        identityCard: '',
        goalUserId: '',
      },
      updatedAt: validLastPing,
    };

    const DIsToDelete: record[] = findAndDeleteExpiredPing(mergedObj);

    const expectedDIsToDelete: record[] = [];
    const expectedMergedObject: mergedObject = {
      aka: [{ record: { userID: 'lol' }, lastPing: validLastPing }],
      es_name: [
        { record: { userID: 'lol' }, lastPing: validLastPing },
        { record: { userID: 'lol' }, lastPing: validLastPing },
      ],
      identifiers: {
        personalNumber: '',
        identityCard: '',
        goalUserId: '',
      },
      updatedAt: validLastPing,
    };

    expect(mergedObj).toEqual(expectedMergedObject);
    expect(DIsToDelete).toEqual(expectedDIsToDelete);
  });
});
