import moment from 'moment';

import { Record, Image, RECORD_TYPE } from './index';

export const getDateFromMs = (timestampInMs: number): moment.Moment => {
  return moment(timestampInMs);
};

export function getFileExtension(fileName: string): string {
  const separatedFileName = fileName.split('.');
  if (separatedFileName.length < 2) return '';
  return fileName.split('.').pop() ?? '';
}

export function getRecordType(record: Record): RECORD_TYPE {
  const extension = getFileExtension(record.ref);
  switch (extension) {
    case 'txt':
      return RECORD_TYPE.TEXT;
    case 'csv':
      return RECORD_TYPE.CSV;
    case 'pdf':
      return RECORD_TYPE.PDF;
    case 'xlsx':
    case 'xls':
      return RECORD_TYPE.XLSX;
    case 'docx':
    case 'doc':
      return RECORD_TYPE.DOCS;
    case 'pptx':
    case 'ppt':
      return RECORD_TYPE.PPT;
    case 'mov':
    case 'MOV':
    case 'MP4':
    case 'mp4':
    case 'avi':
    case 'AVI':
      return RECORD_TYPE.VIDEO;
    default:
      return RECORD_TYPE.IMAGE;
  }
}

export function isImage(record: Record): boolean {
  return getRecordType(record) === RECORD_TYPE.IMAGE;
}

export function isVideo(record: Record): boolean {
  return getRecordType(record) === RECORD_TYPE.VIDEO;
}

export function isNotImage(record: Record): boolean {
  return getRecordType(record) !== RECORD_TYPE.IMAGE;
}

export function isNotVideo(record: Record): boolean {
  return getRecordType(record) !== RECORD_TYPE.VIDEO;
}

export function isContainDocs(records: Record[]): boolean {
  return records.filter(isNotImage).length > 0;
}

export function isContainImage(records: Record[]): boolean {
  return !!records.find(isImage);
}

export function getOnlyImages(records: Record[]): Image[] {
  return records.filter(isImage);
}

export function getVideos(records: Record[]): Record[] {
  return records.filter(isVideo);
}

export function getAllDocuments(records: Record[]): Record[] {
  return records.filter((record: Record) => isNotImage(record) && isNotVideo(record));
}

export function getAllExceptImages(records: Record[]): Record[] {
  return records.filter(isNotImage);
}

export function getNewRecordDatetime(ms?: number): string {
  return getDateFromMs(ms || Date.now()).format('MM/DD/YYYY HH:mm:ss');
}
