import { mapAssetIdPath, getRequestOptions, formatAsset } from '../index';

describe('mapAssetIdPath', () => {
  it('returns the correct asset ID path for rig asset type', () => {
    const assetType = 'rig';
    const expectedPath = ['attributes', 'asset_id'];

    const result = mapAssetIdPath(assetType);

    expect(result).toEqual(expectedPath);
  });

  it('returns the correct asset ID path for well asset type', () => {
    const assetType = 'well';
    const expectedPath = ['attributes', 'asset_id'];

    const result = mapAssetIdPath(assetType);

    expect(result).toEqual(expectedPath);
  });

  it('returns the correct asset ID path for frac_fleet asset type', () => {
    const assetType = 'frac_fleet';
    const expectedPath = ['id'];

    const result = mapAssetIdPath(assetType);

    expect(result).toEqual(expectedPath);
  });

  it('returns the correct asset ID path for pad asset type', () => {
    const assetType = 'pad';
    const expectedPath = ['id'];

    const result = mapAssetIdPath(assetType);

    expect(result).toEqual(expectedPath);
  });

  it('returns the default asset ID path for unknown asset types', () => {
    const assetType = 'unknown';
    const expectedPath = ['id'];

    const result = mapAssetIdPath(assetType);

    expect(result).toEqual(expectedPath);
  });
});

describe('getRequestOptions', () => {
  it('returns the default request options for an asset type without assetFields', () => {
    const assetType = 'rig';
    const expectedOptions = {
      sort: 'name',
      order: 'asc',
      fields: ['rig.name', 'rig.status'],
    };

    const result = getRequestOptions(assetType);

    expect(result).toEqual(expectedOptions);
  });

  it('returns the default request options with additional assetFields', () => {
    const assetType = 'well';
    const assetFields = ['well.latitude', 'well.longitude'];
    const expectedOptions = {
      sort: 'name',
      order: 'asc',
      fields: ['well.name', 'well.status', 'well.latitude', 'well.longitude'],
    };

    const result = getRequestOptions(assetType, assetFields);

    expect(result).toEqual(expectedOptions);
  });
});

describe('formatAsset', () => {
  const ACTIVE_STATUS = 'active';

  it('formats the asset of type "rig"', () => {
    const asset = {
      id: '789',
      type: 'rig',
      name: 'Rig 2',
      activeWell: {
        status: ACTIVE_STATUS,
        id: '123',
      },
    };
    const group = null;
    const activeWellId = null;
    const isRequiredAssetId = false;
    const isPrimaryAsset = false;
    const expectedFormattedAsset = {
      id: 789,
      type: 'rig',
      name: 'Rig 2',
      activeWellId: 123,
    };

    const result = formatAsset({ asset, group, activeWellId, isRequiredAssetId, isPrimaryAsset });

    expect(result).toEqual(expectedFormattedAsset);
  });

  it('formats the asset of type "well"', () => {
    const asset = {
      id: '456',
      type: 'well',
      name: 'Well 2',
    };
    const group = null;
    const activeWellId = 456;
    const isRequiredAssetId = false;
    const isPrimaryAsset = false;
    const expectedFormattedAsset = {
      id: 456,
      type: 'well',
      name: 'Well 2',
      status: ACTIVE_STATUS,
    };

    const result = formatAsset({ asset, group, activeWellId, isRequiredAssetId, isPrimaryAsset });

    expect(result).toEqual(expectedFormattedAsset);
  });
});
