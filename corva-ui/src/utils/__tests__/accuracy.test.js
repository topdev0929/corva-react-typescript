import { getSeverity, getColorBySeverity, purifyPlanName } from '../accuracy';
import { COLOR } from '~/constants/accuracy';

describe('Utils', () => {
  describe('AccuracyUtils', () => {
    describe('getSeverity', () => {
      it('high', () => {
        expect(getSeverity(42, 42, 44)).toBe('high');
        expect(getSeverity(18, 17, 19)).toBe('high');
      });
      it('moderate', () => {
        expect(getSeverity(42, 43, 42)).toBe('moderate');
        expect(getSeverity(18, 19, 17)).toBe('moderate');
      });
      it('low', () => {
        expect(getSeverity(42, 43, 43)).toBe('low');
      });
    });

    describe('purifyPlanName', () => {
      it('removes substring', () => {
        expect(purifyPlanName(`Plan name, Updated Target`)).toBe('Plan name');
      });
      it(`doesn't modify pure well name`, () => {
        expect(purifyPlanName('Updated Target')).toBe('Updated Target');
      });
    });

    describe('getColorBySeverity', () => {
      const accuracyData = { severity: 'low' };

      it(`get severity from 'accuracyData' if no 'severeThreshold' and 'moderateThreshold'`, () => {
        expect(getColorBySeverity(accuracyData, null, null, false)).toBe(COLOR.green);
      });

      describe('dark theme', () => {
        it('low', () => {
          const accuracyData = { distance_to_plan: 42 };
          expect(getColorBySeverity(accuracyData, 43, 43, false)).toBe(COLOR.green);
        });
        it('moderate', () => {
          const accuracyData = { distance_to_plan: 18 };
          expect(getColorBySeverity(accuracyData, 19, 17, false)).toBe(COLOR.yellow);
        });
        it('high', () => {
          const accuracyData = { distance_to_plan: 18 };
          expect(getColorBySeverity(accuracyData, 17, 18, false)).toBe(COLOR.red);
        });
        it('unknown', () => {
          expect(getColorBySeverity(null, null, null, false)).toBe(COLOR.white);
        });
      });

      describe('light theme', () => {
        it('low', () => {
          const accuracyData = { distance_to_plan: 42 };
          expect(getColorBySeverity(accuracyData, 43, 43, true)).toBe(COLOR.green);
        });
        it('moderate', () => {
          const accuracyData = { distance_to_plan: 18 };
          expect(getColorBySeverity(accuracyData, 19, 17, true)).toBe(COLOR.orange);
        });
        it('high', () => {
          const accuracyData = { distance_to_plan: 18 };
          expect(getColorBySeverity(accuracyData, 17, 18, true)).toBe(COLOR.red);
        });
        it('unknown', () => {
          expect(getColorBySeverity(null, null, null, true)).toBe(COLOR.white);
        });
      });
    });
  });
});
