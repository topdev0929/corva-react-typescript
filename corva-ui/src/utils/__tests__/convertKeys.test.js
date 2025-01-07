import { convertKeysToSnakeCase, convertKeysToCamelCase } from '..';

describe('Utils', () => {
  describe('Convert object keys to snake_case', () => {
    it('shoud convert keys of simple object', () => {
      expect(convertKeysToSnakeCase({ appKey: '1', wellId: 'super_well_1' })).toEqual({
        app_key: '1',
        well_id: 'super_well_1',
      });
    });

    it('shoud convert keys of array of simple object', () => {
      expect(
        convertKeysToSnakeCase([
          { appKey: '1', wellId: 'super_well_1' },
          { appKey: '2', wellId: 'super_well_2' },
        ])
      ).toEqual([
        { app_key: '1', well_id: 'super_well_1' },
        { app_key: '2', well_id: 'super_well_2' },
      ]);
    });

    it('shoud convert keys of nested objects', () => {
      expect(
        convertKeysToSnakeCase({
          subscriptionId: '1',
          app: { appKey: '1', wellId: 'super_well_1' },
        })
      ).toEqual({ subscription_id: '1', app: { app_key: '1', well_id: 'super_well_1' } });
    });

    it('shoud convert keys of nested arrays', () => {
      expect(
        convertKeysToSnakeCase({
          subscriptionId: '1',
          apps: [
            { app_key: '1', well_id: 'super_well_1' },
            { app_key: '2', well_id: 'super_well_2' },
          ],
        })
      ).toEqual({
        subscription_id: '1',
        apps: [
          { app_key: '1', well_id: 'super_well_1' },
          { app_key: '2', well_id: 'super_well_2' },
        ],
      });
    });
  });

  describe('Convert object keys to camelCase', () => {
    it('shoud convert keys of simple object', () => {
      expect(convertKeysToCamelCase({ app_key: '1', well_id: 'super_well_1' })).toEqual({
        appKey: '1',
        wellId: 'super_well_1',
      });
    });

    it('shoud convert keys of array of simple object', () => {
      expect(
        convertKeysToCamelCase([
          { app_key: '1', well_id: 'super_well_1' },
          { app_key: '2', well_id: 'super_well_2' },
        ])
      ).toEqual([
        { appKey: '1', wellId: 'super_well_1' },
        { appKey: '2', wellId: 'super_well_2' },
      ]);
    });

    it('shoud convert keys of nested objects', () => {
      expect(
        convertKeysToCamelCase({
          subscription_id: '1',
          app: { app_key: '1', well_id: 'super_well_1' },
        })
      ).toEqual({ subscriptionId: '1', app: { appKey: '1', wellId: 'super_well_1' } });
    });

    it('shoud convert keys of nested arrays', () => {
      expect(
        convertKeysToCamelCase({
          subscription_id: '1',
          apps: [
            { app_key: '1', well_id: 'super_well_1' },
            { app_key: '2', well_id: 'super_well_2' },
          ],
        })
      ).toEqual({
        subscriptionId: '1',
        apps: [
          { appKey: '1', wellId: 'super_well_1' },
          { appKey: '2', wellId: 'super_well_2' },
        ],
      });
    });
  });
});
