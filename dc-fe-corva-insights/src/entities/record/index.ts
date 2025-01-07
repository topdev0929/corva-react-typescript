export * from './helpers';

export enum RECORD_TYPE {
  TEXT,
  PPT,
  CSV,
  IMAGE,
  PDF,
  XLSX,
  DOCS,
  VIDEO,
}

export type Record = {
  id: string;
  datetime: string;
  name: string;
  ref: string;
  link?: string;
};

export type Image = Record;
export type RecordPayload = Omit<Record, 'id'>;
