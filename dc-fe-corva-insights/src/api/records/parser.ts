import { Record, RecordPayload } from '@/entities/record';

export function parseRecordFromJSON(obj: any): Record {
  return {
    id: obj._id,
    datetime: obj.data.datetime,
    name: obj.data.display_name,
    ref: obj.data.file_name,
  };
}

export function convertRecordToJSON(record: RecordPayload): any {
  return {
    datetime: record.datetime,
    display_name: record.name,
    is_folder: false,
    file_name: record.ref,
  };
}

export function parseRecordsFromJSON(list: any[]): Record[] {
  return list.map(item => parseRecordFromJSON(item));
}
