import moment from 'moment';

import {
  getDateFromMs,
  getFileExtension,
  getRecordType,
  isImage,
  isVideo,
  isNotImage,
  isNotVideo,
  isContainDocs,
  isContainImage,
  getOnlyImages,
  getVideos,
  getAllDocuments,
  getAllExceptImages,
  getNewRecordDatetime,
  RECORD_TYPE,
} from '@/entities/record';

describe('Utility functions', () => {
  describe('getDateFromMs', () => {
    it('returns a moment object representing the given timestamp', () => {
      const timestampInMs = 1615622400000; // March 13, 2021
      const expectedMoment = moment(timestampInMs);
      expect(getDateFromMs(timestampInMs)).toEqual(expectedMoment);
    });
  });

  describe('getFileExtension', () => {
    it('returns the file extension given a filename', () => {
      expect(getFileExtension('file.txt')).toEqual('txt');
      expect(getFileExtension('image.jpg')).toEqual('jpg');
      expect(getFileExtension('document.pdf')).toEqual('pdf');
    });

    it('returns an empty string if filename has no extension', () => {
      expect(getFileExtension('file')).toEqual('');
    });
  });

  describe('getRecordType', () => {
    it('returns the correct record type based on file extension', () => {
      expect(
        getRecordType({
          ref: 'file.txt',
          id: '',
          datetime: '',
          name: '',
        })
      ).toEqual(RECORD_TYPE.TEXT);
      expect(
        getRecordType({
          ref: 'image.jpg',
          id: '',
          datetime: '',
          name: '',
        })
      ).toEqual(RECORD_TYPE.IMAGE);
      expect(
        getRecordType({
          ref: 'video.mp4',
          id: '',
          datetime: '',
          name: '',
        })
      ).toEqual(RECORD_TYPE.VIDEO);
      expect(
        getRecordType({
          ref: 'document.pdf',
          id: '',
          datetime: '',
          name: '',
        })
      ).toEqual(RECORD_TYPE.PDF);
      expect(
        getRecordType({
          ref: 'spreadsheet.xlsx',
          id: '',
          datetime: '',
          name: '',
        })
      ).toEqual(RECORD_TYPE.XLSX);
      expect(
        getRecordType({
          ref: 'presentation.pptx',
          id: '',
          datetime: '',
          name: '',
        })
      ).toEqual(RECORD_TYPE.PPT);
    });
  });

  describe('isImage', () => {
    it('returns true if record is an image', () => {
      expect(
        isImage({
          ref: 'image.jpg',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(true);
      expect(
        isImage({
          ref: 'photo.png',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(true);
    });

    it('returns false if record is not an image', () => {
      expect(
        isImage({
          ref: 'document.pdf',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(false);
      expect(
        isImage({
          ref: 'video.mp4',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(false);
    });
  });

  describe('isVideo', () => {
    it('returns true if record is a video', () => {
      expect(
        isVideo({
          ref: 'video.mp4',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(true);
      expect(
        isVideo({
          ref: 'movie.mov',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(true);
    });

    it('returns false if record is not a video', () => {
      expect(
        isVideo({
          ref: 'document.pdf',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(false);
      expect(
        isVideo({
          ref: 'image.jpg',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(false);
    });
  });

  describe('isNotImage', () => {
    it('returns true if record is not an image', () => {
      expect(
        isNotImage({
          ref: 'document.pdf',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(true);
      expect(
        isNotImage({
          ref: 'video.mp4',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(true);
    });

    it('returns false if record is an image', () => {
      expect(
        isNotImage({
          ref: 'image.jpg',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(false);
      expect(
        isNotImage({
          ref: 'photo.png',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(false);
    });
  });

  describe('isNotVideo', () => {
    it('returns true if record is not a video', () => {
      expect(
        isNotVideo({
          ref: 'document.pdf',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(true);
      expect(
        isNotVideo({
          ref: 'image.jpg',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(true);
    });

    it('returns false if record is a video', () => {
      expect(
        isNotVideo({
          ref: 'video.mp4',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(false);
      expect(
        isNotVideo({
          ref: 'movie.mov',
          id: '',
          datetime: '',
          name: '',
        })
      ).toBe(false);
    });
  });

  describe('isContainDocs', () => {
    it('returns true if records contain documents', () => {
      const records = [
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
        { ref: 'spreadsheet.xlsx', id: '', datetime: '', name: '' },
        { ref: 'presentation.pptx', id: '', datetime: '', name: '' },
      ];
      expect(isContainDocs(records)).toBe(true);
    });

    it('returns false if records do not contain documents', () => {
      const records = [
        { ref: 'image.jpg', id: '', datetime: '', name: '' },
        { ref: 'video.mp4', id: '', datetime: '', name: '' },
      ];
      expect(isContainDocs(records)).toBe(true);
    });
  });

  describe('isContainImage', () => {
    it('returns true if records contain images', () => {
      const records = [
        { ref: 'image.jpg', id: '', datetime: '', name: '' },
        { ref: 'photo.png', id: '', datetime: '', name: '' },
      ];
      expect(isContainImage(records)).toBe(true);
    });

    it('returns false if records do not contain images', () => {
      const records = [
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
        { ref: 'video.mp4', id: '', datetime: '', name: '' },
      ];
      expect(isContainImage(records)).toBe(false);
    });
  });

  describe('Utility functions', () => {
    describe('isContainDocs', () => {
      it('returns true if records contain documents', () => {
        const records = [
          { ref: 'document.pdf', id: '', datetime: '', name: '' },
          { ref: 'spreadsheet.xlsx', id: '', datetime: '', name: '' },
          { ref: 'presentation.pptx', id: '', datetime: '', name: '' },
        ];
        expect(isContainDocs(records)).toBe(true);
      });

      it('returns false if records do not contain documents', () => {
        const records = [
          { ref: 'image.jpg', id: '', datetime: '', name: '' },
          { ref: 'video.mp4', id: '', datetime: '', name: '' },
        ];
        expect(isContainDocs(records)).toBe(true);
      });
    });
  });

  describe('isContainImage', () => {
    it('returns true if records contain images', () => {
      const records = [
        { ref: 'image.jpg', id: '', datetime: '', name: '' },
        { ref: 'photo.png', id: '', datetime: '', name: '' },
      ];
      expect(isContainImage(records)).toBe(true);
    });

    it('returns false if records do not contain images', () => {
      const records = [
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
        { ref: 'video.mp4', id: '', datetime: '', name: '' },
      ];
      expect(isContainImage(records)).toBe(false);
    });
  });

  describe('getOnlyImages', () => {
    it('returns an array containing only image records', () => {
      const records = [
        { ref: 'image.jpg', id: '', datetime: '', name: '' },
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
        { ref: 'photo.png', id: '', datetime: '', name: '' },
        { ref: 'video.mp4', id: '', datetime: '', name: '' },
      ];
      const expectedImages = [
        { ref: 'image.jpg', id: '', datetime: '', name: '' },
        { ref: 'photo.png', id: '', datetime: '', name: '' },
      ];
      expect(getOnlyImages(records)).toEqual(expectedImages);
    });
  });

  describe('getVideos', () => {
    it('returns an array containing only video records', () => {
      const records = [
        { ref: 'image.jpg', id: '', datetime: '', name: '' },
        { ref: 'video.mp4', id: '', datetime: '', name: '' },
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
        { ref: 'movie.mov', id: '', datetime: '', name: '' },
      ];
      const expectedVideos = [
        { ref: 'video.mp4', id: '', datetime: '', name: '' },
        { ref: 'movie.mov', id: '', datetime: '', name: '' },
      ];
      expect(getVideos(records)).toEqual(expectedVideos);
    });
  });

  describe('getAllDocuments', () => {
    it('returns an array containing only document records', () => {
      const records = [
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
        { ref: 'spreadsheet.xlsx', id: '', datetime: '', name: '' },
        { ref: 'image.jpg', id: '', datetime: '', name: '' },
        { ref: 'presentation.pptx', id: '', datetime: '', name: '' },
      ];
      const expectedDocuments = [
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
        { ref: 'spreadsheet.xlsx', id: '', datetime: '', name: '' },
        { ref: 'presentation.pptx', id: '', datetime: '', name: '' },
      ];
      expect(getAllDocuments(records)).toEqual(expectedDocuments);
    });
  });

  describe('getAllExceptImages', () => {
    it('returns an array containing all records except images', () => {
      const records = [
        { ref: 'image.jpg', id: '', datetime: '', name: '' },
        { ref: 'video.mp4', id: '', datetime: '', name: '' },
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
        { ref: 'photo.png', id: '', datetime: '', name: '' },
      ];
      const expectedRecords = [
        { ref: 'video.mp4', id: '', datetime: '', name: '' },
        { ref: 'document.pdf', id: '', datetime: '', name: '' },
      ];
      expect(getAllExceptImages(records)).toEqual(expectedRecords);
    });
  });

  describe('getNewRecordDatetime', () => {
    it('returns the current date and time in the specified format', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1615622400000);
      expect(getNewRecordDatetime()).toEqual('03/13/2021 08:00:00');
    });

    it('returns the date and time from the given milliseconds', () => {
      const ms = 1615622400000;
      expect(getNewRecordDatetime(ms)).toEqual('03/13/2021 08:00:00');
    });
  });
});
