import { renderHook } from '@testing-library/react-hooks';
import { useAssetAutoCompleteSelectData } from '../index';
import { jsonApi } from '~/clients';

jest.mock('~/clients');

describe('useAssetAutoCompleteSelectData', () => {
  const defaultProps = {
    appKey: '123',
    assetType: 'well',
    companyId: 1,
    currentValue: 2,
    isMultiple: false,
    parentAssetId: 3,
    parentAssetType: 'parentAsset',
    scrollPage: 1,
    searchText: 'search',
    setCurrentOption: jest.fn(),
    queryParams: { sort: 'name', order: 'asc' },
    assetFields: ['field1', 'field2']
  };
  const commonResponse = {
    data: [
      { id: '1', attributes: { name: 'asset1' }, relationships: { program: { data: { id: '1' } } } },
      { id: '2', attributes: { name: 'asset2' }, relationships: { program: { data: { id: '2' } } } }
    ]
  };

  beforeEach(() => {
    jsonApi.mapAssetGetRequest.mockReturnValue(() => commonResponse);
    jsonApi.getAssets.mockReturnValue(commonResponse);
    jsonApi.getWells.mockReturnValue(commonResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch currently selected option', async () => {
    const { waitForNextUpdate } = renderHook(() => useAssetAutoCompleteSelectData(defaultProps));
    await waitForNextUpdate();
    expect(jsonApi.mapAssetGetRequest('program')()).toEqual(commonResponse);
  });

  it('should fetch currently selected option from v2/assets', async () => {
    jsonApi.mapAssetGetRequest.mockReturnValue(() => ({ data: [] }));
    const { waitForNextUpdate } = renderHook(() => useAssetAutoCompleteSelectData(defaultProps));
    await waitForNextUpdate();
    expect(jsonApi.getAssets).toHaveBeenCalledWith({
      sort: 'name',
      order: 'asc',
      fields: [`well.name`, `well.asset_id`, ...defaultProps.assetFields],
      ids: [2],
    });
  });

  it('should fetch assets', async () => {
    const { waitForNextUpdate } = renderHook(() => useAssetAutoCompleteSelectData(defaultProps));
    await waitForNextUpdate();
    expect(jsonApi.mapAssetGetRequest).toHaveBeenCalledTimes(2);
  });

  it('should handle pagination', async () => {
    jsonApi.mapAssetGetRequest
      .mockReturnValueOnce(() => commonResponse)
      .mockReturnValueOnce(() => ({ data: [{ id: '3', attributes: { name: 'asset3' }, relationships: { program: { data: { id: '3' } } } }]}));
    const { result, waitForNextUpdate } = renderHook(() => useAssetAutoCompleteSelectData(defaultProps));

    await waitForNextUpdate();

    expect(result.current.assets).toEqual([{ id: 3, name: 'asset3', programId: 3 }]);
  });
});
