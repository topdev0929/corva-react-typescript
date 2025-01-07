import { Map, List } from 'immutable';
import { sortBy, cloneDeep } from 'lodash';
import convertAPI from 'corva-convert-units';

import * as convert from '../convert';
import { UNIT_DEFINITIONS, IMPERIAL_UNITS, USER_DATA, angleUniqueUnits } from './fixtures/convert.fixture';

describe('Utils', () => {
  describe('Convert', () => {
    it('should retrieve unit description', () => {
      const expectedResult = {
        abbr: 'ft',
        display: 'ft',
        measure: 'length',
        plural: 'Feet',
        singular: 'Foot',
        system: 'imperial',
      };
      expect(convert.getUnitDescription('ft')).toEqual(expectedResult);
    });

    describe('if no user data', () => {
      beforeEach(() => {
        convert.updateUserUnits({});
      });

      it('should return all units definitions', () => {
        expect(convert.getAllUnitTypes()).toEqual(UNIT_DEFINITIONS);
      });

      it(`should has 'imperial' default units`, () => {
        expect(convert.getDefaultUnits()).toEqual(IMPERIAL_UNITS);
        
      });

      it('should use default unit system to for unit preferences', () => {
        expect(convert.getUnitPreference('oilFlowRate')).toBe('bbl/min');
      });

      describe('should return', () => {
        it('an empty lists for fake type', () => {
          expect(convert.getUnitsByType('fake unit')).toEqual([]);
        });

        UNIT_DEFINITIONS.forEach(({ type, origin }) => {
          it(`lists all the units of ${type} type`, () => {
            const result = sortBy(convertAPI().list(origin), 'abbr');
            expect(convert.getUnitsByType(type)).toEqual(result);
          });
        });
      });

      it('should return current unit system', () => {
        expect(convert.getUnitSystem()).toEqual('imperial');
      });

      it('should retrieve the unit display name for a given unit type', () => {
        expect(convert.getUnitDisplay(null, 'in')).toBe('in');
      });

      it('should retrieve the same unit display name for a fake given unit type', () => {
        expect(convert.getUnitDisplay(null, 'fakeUnit')).toEqual('fakeUnit');
      });

      it('should retrieve the unit display name for imperial unit type', () => {
        expect(convert.getDefaultImperialUnit('length')).toBe('ft');
      });

      describe('should convert single value', () => {
        it('to the same value if no unit from convert to', () => {
          expect(convert.convertValue(100, 'length')).toBe(100);
        });

        it('to the same converted value if value is 0', () => {
          expect(convert.convertValue(0, 'length')).toBe(0);
        });

        it('to target unit type from current type', () => {
          const value = 100;
          const from = 'm';
          const to = 'ft';
          const unitType = 'length';

          const expectedresultDecimal = 328.08;
          const resultDecimal = convert.convertValue(value, unitType, from, to);
          expect(resultDecimal).toBe(expectedresultDecimal);

          const decimalValue = 0;
          const expectedResult = 328;
          const result = convert.convertValue(value, unitType, from, to, decimalValue);
          expect(result).toBe(expectedResult);
        });

        it(`returns initial value if 'to' is not set and not preferenced`, () => {
          const value = 'value';
          const from = 'm';
          const unitType = 'unknownType';
          expect(convert.convertValue(value, unitType, from)).toEqual(value);
        });

        it(`returns converted value if it's infinite`, () => {
          const value = Infinity;
          const from = 'm';
          const to = 'ft';
          const unitType = 'length';
          expect(convert.convertValue(value, unitType, from, to)).toEqual(value);
        });
      });

      it('should convert immutable values', () => {
        const key = 'dp';
        const value = 42;
        const data = List([Map({ [key]: value })]);
        const unitType = 'pressure';
        const from = 'psi';
        const to = 'kPa';
        const result = convert.convertImmutables(data, key, unitType, from, to);
        const expectedConvertedValue = 289.58;
        expect(result.get(0).get(key)).toBe(expectedConvertedValue);
      });

      it('should allows you to convert the immutables by multiple keys/units at once', () => {
        const key = 'key1';
        const key2 = 'key2';
        const from = 'kg';
        const from2 = 'psi';
        const unitType = 'mass';
        const unitType2 = 'pressure';
        const to = 'lb';
        const to2 = 'kPa';
        const value = 42;
        const value2 = 100;
        const data = List([
          Map({
            [key]: value,
            [key2]: value2,
          }),
        ]);
        const convertRules = [
          {
            key,
            unitType,
            from,
            to,
          },
          {
            key: key2,
            unitType: unitType2,
            from: from2,
            to: to2,
          },
        ];
        const result = convert.convertImmutablesByBatch(data, convertRules);
        const expectedResult = List([
          Map({
            [key]: 92.59,
            [key2]: 689.48,
          }),
        ]);
        expect(result).toEqual(expectedResult);
      });

      it('should convert a property in a simple array of js objects', () => {
        const key = 'key';
        const val1 = 42;
        const val2 = 100;
        const val3 = 50;
        const values = [{ [key]: val1 }, { [key]: val2 }, { [key]: val3 }];
        const unitType = 'mass';
        const from = 'kg';
        const to = 'lb';
        const result = convert.convertArray(values, key, unitType, from, to);
        const expectedResult = [
          {
            [key]: 92.59,
          },
          {
            [key]: 220.46,
          },
          {
            [key]: 110.23,
          },
        ];
        expect(result).toEqual(expectedResult);
      });

      it(`returns empty array if 'iterable' wasn't passed`, () => {
        const key = 'key';
        const values = undefined;
        const unitType = 'mass';
        const from = 'kg';
        const to = 'lb';
        const result = convert.convertArray(values, key, unitType, from, to);
        expect(result).toEqual([]);
      });
    });

    describe('if user has company and user units', () => {
      const useCompanyUnits = () => convert.updateUserUnits({ companyUnits: USER_DATA.companyUnits });

      beforeEach(() => {
        convert.updateUserUnits(USER_DATA);
      });

      it('should have mixed user units and company units', () => {
        const mergeUnits = {
          ...USER_DATA.companyUnits,
          ...USER_DATA.userUnits,
        };
        expect(convert.getDefaultUnits()).toEqual(expect.objectContaining(mergeUnits));
      });

      it('if no user units should use company and default units', () => {
        useCompanyUnits();
        expect(convert.getDefaultUnits()).toEqual(expect.objectContaining(USER_DATA.companyUnits));
      });

      it('should use user unit type by default', () => {
        expect(convert.getUnitPreference('angle')).toBe('rad');
      });

      it(`should use company unit type if user doesn't have it`, () => {
        expect(convert.getUnitPreference('density')).toBe('kg/m3');
      });

      it('should use user unit system by default', () => {
        expect(convert.getUnitSystem()).toBe('custom');
      });

      it('should retrieves the unit display name for a given unit type', () => {
        expect(convert.getUnitDisplay('angle')).toBe('rad');

        useCompanyUnits();
        expect(convert.getUnitDisplay('angle')).toBe('grad');
      });

      it('should retrieves the full name for a given unit type, singular depends on user units', () => {
        expect(convert.getUnitSingular('angle')).toBe('radian');

        useCompanyUnits();
        expect(convert.getUnitSingular('angle')).toBe('gradian');
      });

      it('should retrieves the full name for a given unit type, plural depends on user units', () => {
        expect(convert.getUnitPlural('angle')).toBe('radians');

        useCompanyUnits();
        expect(convert.getUnitPlural('angle')).toBe('gradians');
      });

      it('should convert value depends on user units', () => {
        expect(convert.convertValue(1000, 'mass', 'g')).toBe(1);

        useCompanyUnits();
        expect(convert.convertValue(1000, 'mass', 'g')).toBe(35.27);
      });

      it('should convert immutable values', () => {
        const key = 'key';
        const value = 1000;
        const data = List([Map({ [key]: value })]);
        const unitType = 'mass';
        const from = 'g';

        const userResult = convert.convertImmutables(data, key, unitType, from);
        expect(userResult.get(0).get(key)).toBe(1);

        useCompanyUnits();
        const companyResult = convert.convertImmutables(data, key, unitType, from);
        expect(companyResult.get(0).get(key)).toBe(35.27);
      });

      it('should allows you to convert the immutables by multiple keys/units at once', () => {
        const key = 'key1';
        const key2 = 'key2';
        const from = 'g';
        const from2 = 'deg';
        const unitType = 'mass';
        const unitType2 = 'angle';
        const value = 1000;
        const value2 = 100;
        const data = List([
          Map({
            [key]: value,
            [key2]: value2,
          }),
        ]);
        const convertRules = [
          {
            key,
            unitType,
            from,
          },
          {
            key: key2,
            unitType: unitType2,
            from: from2,
          },
        ];
        const expectedUserResult = List([
          Map({
            [key]: 1,
            [key2]: 1.75,
          }),
        ]);
        expect(convert.convertImmutablesByBatch(data, convertRules)).toEqual(expectedUserResult);

        useCompanyUnits();
        const expectedCompanyResult = List([
          Map({
            [key]: 35.27,
            [key2]: 111.11,
          }),
        ]);
        expect(convert.convertImmutablesByBatch(data, convertRules)).toEqual(expectedCompanyResult);
      });

      it('should convert a property in a simple array of js objects', () => {
        const key = 'key';
        const val1 = 42;
        const val2 = 100;
        const val3 = 50;
        const values = [{ [key]: val1 }, { [key]: val2 }, { [key]: val3 }];
        const companyValues = cloneDeep(values);
        const unitType = 'angle';
        const from = 'deg';
        const expectedUserResult = [
          {
            [key]: 0.73,
          },
          {
            [key]: 1.75,
          },
          {
            [key]: 0.87,
          },
        ];
        expect(convert.convertArray(values, key, unitType, from)).toEqual(expectedUserResult);

        useCompanyUnits();
        const expectedCompanyResult = [
          {
            [key]: 46.67,
          },
          {
            [key]: 111.11,
          },
          {
            [key]: 55.56,
          },
        ];
        expect(convert.convertArray(companyValues, key, unitType, from)).toEqual(
          expectedCompanyResult,
        );
      });
    });

    describe('getUniqueUnitsByType', () => {
      it('Returns unique units list for some measurements that use same units for imperial and metric system', () => {
        expect(convert.getUniqueUnitsByType('angle')).toEqual(angleUniqueUnits);
      });
    });
  });
});
