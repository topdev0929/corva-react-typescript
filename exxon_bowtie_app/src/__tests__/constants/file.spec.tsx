import {
  getRequestCommonData,
  getSecTimestamp,
  parseRecordFromJSON,
  convertRecordToJSON,
  parseRecordsFromJSON,
} from '@/constants/file.const';

describe('getRequestCommonData', () => {
  it('returns common data object with provided parameters', () => {
    const companyId = 123;
    const dataset = 'example_dataset';
    const assetId = 456;
    const commonData = getRequestCommonData(companyId, dataset, assetId);

    expect(commonData).toEqual({
      version: 1,
      company_id: companyId,
      asset_id: assetId,
      provider: expect.anything(),
      collection: dataset,
    });
  });
});

describe('getSecTimestamp', () => {
  it('returns current timestamp in seconds', () => {
    const timestamp = getSecTimestamp();
    expect(timestamp).toEqual(expect.any(Number));
  });
});

describe('parseRecordFromJSON', () => {
  it('parses JSON object into Record object', () => {
    const jsonRecord = {
      _id: 'example_id',
      data: {
        datetime: '2024-03-14T12:00:00',
        display_name: 'Example Display Name',
        file_name: 'example_file.txt',
      },
    };
    const record = parseRecordFromJSON(jsonRecord);

    expect(record).toEqual({
      id: 'example_id',
      datetime: '2024-03-14T12:00:00',
      name: 'Example Display Name',
      ref: 'example_file.txt',
    });
  });
});

describe('convertRecordToJSON', () => {
  it('converts Record object into JSON object', () => {
    const record = {
      datetime: '2024-03-14T12:00:00',
      name: 'Example Display Name',
      ref: 'example_file.txt',
    };
    const jsonRecord = convertRecordToJSON(record);

    expect(jsonRecord).toEqual({
      datetime: '2024-03-14T12:00:00',
      display_name: 'Example Display Name',
      is_folder: false,
      file_name: 'example_file.txt',
    });
  });
});

describe('parseRecordsFromJSON', () => {
  it('parses list of JSON objects into list of Record objects', () => {
    const jsonRecords = [
      {
        _id: 'example_id_1',
        data: {
          datetime: '2024-03-14T12:00:00',
          display_name: 'Example Display Name 1',
          file_name: 'example_file_1.txt',
        },
      },
      {
        _id: 'example_id_2',
        data: {
          datetime: '2024-03-15T12:00:00',
          display_name: 'Example Display Name 2',
          file_name: 'example_file_2.txt',
        },
      },
    ];
    const records = parseRecordsFromJSON(jsonRecords);

    expect(records).toEqual([
      {
        id: 'example_id_1',
        datetime: '2024-03-14T12:00:00',
        name: 'Example Display Name 1',
        ref: 'example_file_1.txt',
      },
      {
        id: 'example_id_2',
        datetime: '2024-03-15T12:00:00',
        name: 'Example Display Name 2',
        ref: 'example_file_2.txt',
      },
    ]);
  });
});
