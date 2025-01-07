import { getSelectRenderValue, getSelectRenderValueV2, stopPropagation } from '../components';

describe('Util', () => {
  describe('components', () => {
    beforeEach(jest.restoreAllMocks);
    describe('stopPropagation', () => {
      it(`calls stop propagation`, () => {
        const e = {stopPropagation};
        jest.spyOn(e, 'stopPropagation').mockImplementation(() => null);
        stopPropagation(e);
        expect(e.stopPropagation.mock.calls.length).toBe(1);
      });
      it(`doesn't call stop propagation if argument is not passed`, () => {
        expect(() => stopPropagation()).not.toThrow();
      });
      it(`doesn't call stop propagation if argument doesn't have 'stopPropagation' method`, () => {
        const e = {};
        expect(() => stopPropagation(e)).not.toThrow();
      });
    });

    describe('getSelectRenderValue', () => {
      const items = [
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
        { id: 3, name: 'three' },
      ];
      it(`returns string of selected values`, () => {
        const selectedValues = [1, 3];
        expect(getSelectRenderValue(selectedValues, items, 'id', 'name')).toBe('one, three');
      });
      it(`returns empty string if no selected values`, () => {
        const selectedValues = [];
        expect(getSelectRenderValue(selectedValues, items, 'id', 'name')).toBe('');
      });
    });

    describe('getSelectRenderValueV2', () => {
      const items = [
        { id: 1, attributes: { name: 'one' } },
        { id: 2, attributes: { name: 'two' } },
        { id: 3, attributes: { name: 'three' } },
      ];
      it(`returns string of selected values`, () => {
        const selectedValues = [1, '3'];
        expect(getSelectRenderValueV2(selectedValues, items, ['id'], 'name')).toBe('one, three');
      });
      it(`returns empty string if no selected values`, () => {
        const selectedValues = [];
        expect(getSelectRenderValueV2(selectedValues, items, ['id'], 'name')).toBe('');
      });
    });
  });
});
