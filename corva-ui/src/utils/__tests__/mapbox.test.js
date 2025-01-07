import * as mapbox from '../mapbox';

describe('Utils', () => {
  describe('mapbox', () => {
    describe('parseLatLng', () => {
      it(`returns empty array if arg is not string`, () => {
        expect(mapbox.parseLatLng(42)).toEqual([]);
      });

      it(`returns empty array if no arg`, () => {
        expect(mapbox.parseLatLng()).toEqual([]);
      });

      it(`returns empty array if arg is empty`, () => {
        expect(mapbox.parseLatLng('42.18,-18')).toEqual([42.18, -18]);
      });

      it(`returns coords from Delimited Degrees Minutes Seconds with symbols & suffix`, () => {
        expect(mapbox.parseLatLng(`41°24'12.2"N 2°10'26.5"W`)).toEqual([41.40338888888889, -2.1740277777777774]);
      });

      it(`swaps results if first coord is west or east`, () => {
        expect(mapbox.parseLatLng(`41°24'12.2"W 2°10'26.5"N`)).toEqual([2.1740277777777774, -41.40338888888889]);
        expect(mapbox.parseLatLng(`41°24'12.2"E 2°10'26.5"S`)).toEqual([-2.1740277777777774, 41.40338888888889]);
      });
    });

    describe('getDistanceByCoordinates', () => {
      it(`positive coordinates`, () => {
        expect(mapbox.getDistanceByCoordinates([42, 18], [42, 18])).toEqual(0);
      });

      it(`negative coordinates`, () => {
        expect(mapbox.getDistanceByCoordinates([-42.0005, -18.2986592370], [-18.2986592370, -42.0005])).toEqual(2149.8165925222356);
      });

      it(`mixed coordinates`, () => {
        expect(mapbox.getDistanceByCoordinates([-42.29375692, 18.34869038209], [42.29375692, -18.34869038209])).toEqual(6274.3172037825);
      });
    });

    describe('isValidLatLng', () => {
      it(`returns true if LatLng is valid`, () => {
        expect(mapbox.isValidLatLng([42, -18])).toBeTruthy();
      });

      it(`returns false if LatLng is not array`, () => {
        expect(mapbox.isValidLatLng(42)).toBeFalsy();
      });

      it(`returns false if LatLng length is not 2`, () => {
        expect(mapbox.isValidLatLng([42])).toBeFalsy();
      });

      it(`returns false if some part is infinite`, () => {
        expect(mapbox.isValidLatLng([Infinity, -18])).toBeFalsy();
        expect(mapbox.isValidLatLng([42, Infinity])).toBeFalsy();
      });
    });

    describe('isValidCoordinates', () => {
      it(`returns true if lat abs <= 90 and lng abs <= 180`, () => {
        expect(mapbox.isValidCoordinates([90, 180])).toEqual(true);
        expect(mapbox.isValidCoordinates([-90, -180])).toEqual(true);
      });

      it(`returns false if lat abs > 90 and lng abs > 180`, () => {
        expect(mapbox.isValidCoordinates([91, 181])).toEqual(false);
      });

      it(`returns false if lat abs > 90`, () => {
        expect(mapbox.isValidCoordinates([90.001, 42])).toEqual(false);
        expect(mapbox.isValidCoordinates([-90.001, 42])).toEqual(false);
      });

      it(`returns false if lng abs > 180`, () => {
        expect(mapbox.isValidCoordinates([42, 180.0001])).toEqual(false);
        expect(mapbox.isValidCoordinates([42, -180.001])).toEqual(false);
      });
    });

    describe('getAssetCoordinates', () => {
      const coordinates = [42, 18];
      const raw = '42,18';
      it(`returns 'null' if no asset passed`, () => {
        expect(mapbox.getAssetCoordinates()).toBeNull();
      });

      it(`returns coordinates if asset 'top_hole' has 'coordinates'`, () => {
        expect(mapbox.getAssetCoordinates({ top_hole: { raw, coordinates } })).toEqual(coordinates);
      });

      it(`returns coordinates if asset 'top_hole' has 'raw' instead of 'coordinates'`, () => {
        expect(mapbox.getAssetCoordinates({ top_hole: { raw, coordinates: null } })).toEqual(coordinates);
      });

      it(`returns coordinates if asset 'top_hole' has 'raw' instead of 'coordinates' and 'raw' is not 'isValidLatLng'`, () => {
        expect(mapbox.getAssetCoordinates({ top_hole: { raw: '42', coordinates: null } })).toEqual(null);
      });

      it(`returns 'null' if asset 'top_hole' has no 'raw' nor 'coordinates'`, () => {
        expect(mapbox.getAssetCoordinates({ top_hole: { raw: null, coordinates: null } })).toEqual(null);
      });
    });

    describe('getAssetV2Coordinates', () => {
      const coordinates = [42, 18];
      it(`returns 'null' if no asset passed`, () => {
        expect(mapbox.getAssetV2Coordinates()).toBeNull();
      });

      it(`returns coordinates if asset 'top_hole' has 'coordinates'`, () => {
        expect(mapbox.getAssetV2Coordinates({
          attributes: {
            top_hole: {
              coordinates,
              raw: '42,18',
            },
          },
        })).toEqual(coordinates);
      });

      it(`returns coordinates if asset 'top_hole' has 'raw' instead of 'coordinates'`, () => {
        expect(mapbox.getAssetV2Coordinates({
          attributes: {
            top_hole: {
              coordinates: null,
              raw: '42,18',
            },
          },
        })).toEqual(coordinates);
      });

      it(`returns coordinates if asset 'top_hole' has 'raw' instead of 'coordinates' and 'raw' is not 'isValidLatLng'`, () => {
        expect(mapbox.getAssetV2Coordinates({
          attributes: {
            top_hole: {
              coordinates: null,
              raw: '-18',
            },
          },
        })).toEqual(null);
      });

      it(`returns 'null' if asset 'top_hole' has no 'raw' nor 'coordinates'`, () => {
        expect(mapbox.getAssetV2Coordinates({
          attributes: {
            top_hole: {
              coordinates: null,
              raw: null,
            },
          },
        })).toEqual(null);
      });

      it(`returns 'null' if asset has no 'top_hole'`, () => {
        expect(mapbox.getAssetV2Coordinates({
          attributes: {},
        })).toEqual(null);
      });

      it(`path to 'coordinates' may be passed via arguments`, () => {
        expect(mapbox.getAssetV2Coordinates({
          otherAttributes: {
            topHole: {
              coordinates,
              raw: null,
            },
          },
        }, 'otherAttributes.topHole')).toEqual(coordinates);
      });
    });
  });
});
