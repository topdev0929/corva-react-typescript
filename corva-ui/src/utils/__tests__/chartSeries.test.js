import { smoothenSerie } from '../chartSeries';

describe('Util', () => {
  describe('chartSeries', () => {
    describe('smoothenSerie', () => {
      it(`returns data if data is empty`, () => {
        expect(smoothenSerie([])).toMatchObject([]);
      });
      it(`doesn't filter if step is lower than each X. Filters out last point`, () => {
        expect(
          smoothenSerie(
            [
              [1, 1],
              [3, 3],
              [7, 7],
              [10, 10],
            ],
            2,
          ),
        ).toMatchObject([
          [1, 1],
          [3, 3],
          [7, 7],
        ]);
      });
      it(`filters if step is lower than each X. Gets average`, () => {
        expect(
          smoothenSerie(
            [
              [1, 1],
              [3, 3],
              [7, 7],
              [10, 10],
            ],
            3,
          ),
        ).toMatchObject([
          [2, 2],
          [7, 7],
        ]);
      });
    });
  });
});
