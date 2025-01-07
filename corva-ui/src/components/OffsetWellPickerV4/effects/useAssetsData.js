import { useState, useMemo, useEffect } from 'react';
import { debounce, groupBy, every, flatten, toPairs } from 'lodash';
import { fetchAllAssets } from '../utils/apiCalls';

const debouncedFunc = debounce(callback => {
  callback();
}, 500);

const isMatchedAsset = (assetName, searchKey) => {
  const searchKeys = (searchKey || '').split(' ');

  return every(searchKeys, key => assetName.toLowerCase().includes(key || ''));
};

export function useAssetsData(searchKey, assetType, page, company, selectedWellIds) {
  const [assetsData, setAssetsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multiPageData, setMultiPageData] = useState({});

  useEffect(() => {
    async function fetchAssets() {
      try {
        const assets = await fetchAllAssets(searchKey, assetType, page, company);
        const multiPageAssets = flatten(
          toPairs(multiPageData)
            .filter(item => +item[0] < +page)
            .map(data => data[1])
        ).concat(assets);
        setAssetsData(multiPageAssets);
        setMultiPageData(prev => ({ ...prev, searchKey, assetType, [page]: assets }));
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    setLoading(true);
    debouncedFunc(fetchAssets);
  }, [searchKey, assetType, page, company]);

  const searchResult = useMemo(() => {
    const checkedAssets = assetsData.map(asset => ({
      ...asset,
      checked: selectedWellIds.includes(asset.redirectAssetId),
    }));
    const filteredData = checkedAssets.filter(
      asset =>
        (!assetType || asset.type === assetType) &&
        isMatchedAsset(asset.name, (searchKey || '').toLowerCase())
    );
    const groupData = Object.entries(groupBy(filteredData, 'type'));
    return groupData;
  }, [searchKey, assetsData, assetType, selectedWellIds]);

  return [loading, searchResult];
}
