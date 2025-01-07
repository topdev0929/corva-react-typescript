import { Record, RECORD_TYPE } from '../entities/record';

export const mockedRecordNamesWithTypes = [
  {
    name: 'image.png',
    ref: 'image.png',
    type: RECORD_TYPE.IMAGE,
  },
  {
    name: 'pdf.pdf',
    ref: 'pdf.pdf',
    type: RECORD_TYPE.PDF,
  },
  {
    name: 'csv.csv',
    ref: 'csv.csv',
    type: RECORD_TYPE.CSV,
  },
  {
    name: 'text.txt',
    ref: 'text.txt',
    type: RECORD_TYPE.TEXT,
  },
  {
    name: 'xlsx.xlsx',
    ref: 'xlsx.xlsx',
    type: RECORD_TYPE.XLSX,
  },
  {
    name: 'docs.docx',
    ref: 'docs.docx',
    type: RECORD_TYPE.DOCS,
  },
  {
    name: 'ppt.pptx',
    ref: 'ppt.pptx',
    type: RECORD_TYPE.PPT,
  },
  {
    name: 'mp4.mp4',
    ref: 'mp4.mp4',
    type: RECORD_TYPE.VIDEO,
  },
  {
    name: 'MP4.MP4',
    ref: 'MP4.MP4',
    type: RECORD_TYPE.VIDEO,
  },
  {
    name: 'mov.mov',
    ref: 'mov.mov',
    type: RECORD_TYPE.VIDEO,
  },
  {
    name: 'MOV.MOV',
    ref: 'MOV.MOV',
    type: RECORD_TYPE.VIDEO,
  },
  {
    name: 'avi.avi',
    ref: 'avi.avi',
    type: RECORD_TYPE.VIDEO,
  },
  {
    name: 'AVI.AVI',
    ref: 'AVI.AVI',
    type: RECORD_TYPE.VIDEO,
  },
];

export const mockedRecord: Record = {
  id: '1',
  name: 'Record 1',
  ref: 'Record 1',
  datetime: '2021-01-01',
};

export const mockedRecordWithLink: Record = {
  ...mockedRecord,
  link: 'https://picsum.photos/200',
};
