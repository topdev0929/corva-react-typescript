import { getDeprecatedAssetIds } from '../dataResolvers';

describe('getDeprecatedAssetIds', () => {
  describe('apps with settings', () => {
    it('returns nothing for app with selected rig', () => {
      expect(getDeprecatedAssetIds([{ settings: { rigId: 111 } }])).toEqual([]);
    });

    it('returns nothing for app with selected well', () => {
      expect(getDeprecatedAssetIds([{ settings: { wellId: 111 } }])).toEqual([]);
    });

    it('returns nothing for app with selected frac fleet', () => {
      expect(getDeprecatedAssetIds([{ settings: { fracFleetId: 111 } }])).toEqual([]);
    });

    it('returns nothing for app with selected pad', () => {
      expect(getDeprecatedAssetIds([{ settings: { padId: 111 } }])).toEqual([]);
    });
  });

  it('returns deprecatedAssetId if it exist', () => {
    expect(getDeprecatedAssetIds([{ settings: { deprecatedAssetId: 123 } }])).toEqual([123]);
  });

  it('returns assetDashboard id if app has not settings', () => {
    expect(getDeprecatedAssetIds([{}], 456)).toEqual([456]);
  });
});
