import { renderHook } from '@testing-library/react-hooks';
import { useAssetSelectData } from '../index';
import { jsonApi } from '~/clients';

const mockResponse = {
  data: [
    {
      id: '1',
      attributes: { name: 'asset 1' },
      relationships: {
        program: {
          data: { id: '1' },
        },
      },
    },
  ],
};

jest.mock('~/clients', () => ({
  jsonApi: {
    mapAssetGetRequest: jest.fn().mockReturnValue(() => Promise.resolve(mockResponse)),
  }
}));

describe('useAssetSelectData', () => {
  const defaultProps = {
    assetType: 'well',
    parentAssetType: 'well',
    parentAssetTypeId: 1,
    appKey: 'mockAppKey',
    queryParams: { sort: 'name', order: 'asc' },
  };

  it('should call mapAssetGetRequest on mount', async () => {
    const { waitForNextUpdate } = renderHook(() => useAssetSelectData(defaultProps));
    await waitForNextUpdate();
    expect(jsonApi.mapAssetGetRequest).toHaveBeenCalledWith(defaultProps.assetType);
  });

  it('should return fetched assets', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAssetSelectData(defaultProps));
    await waitForNextUpdate();
    expect(result.current.assets).toEqual([{ id: 1, name: 'asset 1', programId: 1 }]);
  });

  it('should toggle loading', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAssetSelectData(defaultProps));
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
  });
});
