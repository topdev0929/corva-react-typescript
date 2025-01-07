import { mockedRecord, mockedRecordNamesWithTypes } from '@/mocks/record';

import {
  getRecordType,
  getNewRecordDatetime,
  isImage,
  isNotImage,
  getOnlyImages,
  isContainImage,
  getAllExceptImages,
  isContainDocs,
  isVideo,
  getVideos,
  isNotVideo,
  getAllDocuments,
} from '../helpers';
import { RECORD_TYPE } from '../index';

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
const IMAGE_NAME = 'image.png';
const TEXT_NAME = 'text.txt';
const VIDEO_NAME = 'video.mp4';

const testGetRecordType = (name: string, expected: RECORD_TYPE, ref: string) => {
  const result = getRecordType({ ...mockedRecord, name, ref });
  expect(result).toBe(expected);
};

describe('Record helpers', () => {
  describe('getRecordType', () => {
    it('should return appropriate type', () => {
      mockedRecordNamesWithTypes.forEach(({ name, type, ref }) => {
        testGetRecordType(name, type, ref);
      });
    });

    it('should return IMAGE by default', () => {
      const result = getRecordType(mockedRecord);
      expect(result).toBe(RECORD_TYPE.IMAGE);
    });
  });

  describe('getNewRecordDatetime', () => {
    it('should return formatted date', () => {
      const result = getNewRecordDatetime(1591507200000);
      expect(result).toBe('06/07/2020 05:20:00');
    });

    it('should return default formatted date if milliseconds not passed', () => {
      const result = getNewRecordDatetime();
      expect(result).toBe('01/01/2020 00:00:00');
    });
  });

  describe('isImage', () => {
    it('should return true if record is image', () => {
      const result = isImage({ ...mockedRecord, name: IMAGE_NAME, ref: 'image.png' });
      expect(result).toBeTruthy();
    });

    it('should return false if record is not image', () => {
      const result = isImage({ ...mockedRecord, name: TEXT_NAME, ref: 'xlsx.xlsx' });
      expect(result).toBeFalsy();
    });
  });

  describe('isNotImage', () => {
    it('should return true if record is not image', () => {
      const result = isNotImage({ ...mockedRecord, name: TEXT_NAME, ref: 'image.mov' });
      expect(result).toBeTruthy();
    });

    it('should return false if record is image', () => {
      const result = isNotImage({ ...mockedRecord, name: IMAGE_NAME });
      expect(result).toBeFalsy();
    });
  });

  describe('getOnlyImages', () => {
    it('should return only images', () => {
      const result = getOnlyImages([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' },
      ]);
      expect(result).toEqual([{ ...mockedRecord, name: IMAGE_NAME }]);
    });
  });

  describe('isContainImage', () => {
    it('should return true if records contain image', () => {
      const result = isContainImage([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: TEXT_NAME },
      ]);
      expect(result).toBeTruthy();
    });

    it('should return false if records do not contain image', () => {
      const result = isContainImage([
        { ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' },
        { ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' },
      ]);
      expect(result).toBeFalsy();
    });

    it('should return false if records is empty', () => {
      const result = isContainImage([]);
      expect(result).toBeFalsy();
    });
  });

  describe('getAllExceptImages', () => {
    it('should return all records except images', () => {
      const result = getAllExceptImages([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' },
      ]);
      expect(result).toEqual([{ ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' }]);
    });

    it('should return empty list if there are only images', () => {
      const result = getAllExceptImages([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: IMAGE_NAME },
      ]);
      expect(result).toEqual([]);
    });

    it('should return empty list if there are no records', () => {
      const result = getAllExceptImages([]);
      expect(result).toEqual([]);
    });
  });

  describe('isContainDocs', () => {
    it('should return true if records contain docs', () => {
      const result = isContainDocs([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' },
      ]);
      expect(result).toBeTruthy();
    });

    it('should return false if records do not contain docs', () => {
      const result = isContainDocs([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: IMAGE_NAME },
      ]);
      expect(result).toBeFalsy();
    });

    it('should return false if records list is empty', () => {
      const result = isContainDocs([]);
      expect(result).toBeFalsy();
    });
  });

  describe('isVideo', () => {
    it('returns true if record is video', () => {
      const result = isVideo({ ...mockedRecord, name: VIDEO_NAME, ref: 'video.mp4' });
      expect(result).toBeTruthy();
    });

    it('returns false if record is image', () => {
      const result = isVideo({ ...mockedRecord, name: IMAGE_NAME });
      expect(result).toBeFalsy();
    });

    it('returns false if record is text file', () => {
      const result = isVideo({ ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' });
      expect(result).toBeFalsy();
    });
  });

  describe('isNotVideo', () => {
    it('returns true if record is not video', () => {
      const result = isNotVideo({ ...mockedRecord, name: TEXT_NAME });
      expect(result).toBeTruthy();
    });

    it('returns false if record is video', () => {
      const result = isNotVideo({ ...mockedRecord, name: VIDEO_NAME, ref: 'video.mov' });
      expect(result).toBeFalsy();
    });
  });

  describe('getVideos', () => {
    it('returns all videos except other files', () => {
      const additionalVideoName = `2${VIDEO_NAME}`;
      const result = getVideos([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' },
        { ...mockedRecord, name: TEXT_NAME, ref: 'text5.txt' },
        { ...mockedRecord, name: VIDEO_NAME, ref: 'video.mov' },
        { ...mockedRecord, name: additionalVideoName, ref: 'video.mov' },
      ]);

      expect(result).toEqual([
        { ...mockedRecord, name: VIDEO_NAME, ref: 'video.mov' },
        { ...mockedRecord, name: additionalVideoName, ref: 'video.mov' },
      ]);
    });

    it('returns empty list if there are files with no video file type', () => {
      const result = getVideos([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: IMAGE_NAME },
      ]);
      expect(result).toEqual([]);
    });

    it('should return empty list if there are no records', () => {
      const result = getVideos([]);
      expect(result).toEqual([]);
    });
  });

  describe('getAllDocuments', () => {
    it('returns all text documents except other files', () => {
      const additionalTextDocumentName = `2${TEXT_NAME}`;
      const result = getAllDocuments([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: VIDEO_NAME, ref: 'video.mov' },
        { ...mockedRecord, name: VIDEO_NAME, ref: 'video.mov' },
        { ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' },
        { ...mockedRecord, name: additionalTextDocumentName, ref: 'text.txt' },
      ]);

      expect(result).toEqual([
        { ...mockedRecord, name: TEXT_NAME, ref: 'text.txt' },
        { ...mockedRecord, name: additionalTextDocumentName, ref: 'text.txt' },
      ]);
    });

    it('returns empty list if there are files with no text file type', () => {
      const result = getAllDocuments([
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: IMAGE_NAME },
        { ...mockedRecord, name: VIDEO_NAME },
        { ...mockedRecord, name: VIDEO_NAME },
      ]);
      expect(result).toEqual([]);
    });

    it('should return empty list if there are no records', () => {
      const result = getAllDocuments([]);
      expect(result).toEqual([]);
    });
  });
});
