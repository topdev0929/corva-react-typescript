import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';
import groupBy from 'lodash/groupBy';
import every from 'lodash/every';

import { fetchAllAssets } from '../../../../../../utils/apiCalls';

const debouncedFunc = debounce(callback => {
  callback();
}, 500);

const isMatchedAsset = (assetName, searchKey) => {
  const searchKeys = searchKey.split(' ');

  return every(searchKeys, key => assetName.toLowerCase().includes(key || ''));
};

export function useAssetsData(searchKey, assetType, page, company) {
  const [assetsData, setAssetsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const assets = await fetchAllAssets(assetType, page, company);
        setAssetsData(assets);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    setLoading(true);
    debouncedFunc(fetchAssets);
  }, [assetType, page, company]);

  const searchResult = useMemo(() => {
    const filteredData = assetsData.filter(
      asset =>
        (!assetType || asset.type === assetType) &&
        (isMatchedAsset(asset.name, (searchKey || '').toLowerCase()) ||
          asset.apiNumber?.toLowerCase().includes((searchKey || '').toLowerCase()))
    );
    const groupData = Object.entries(groupBy(filteredData, 'type'));
    return groupData;
  }, [searchKey, assetsData, assetType]);

  return [loading, searchResult];
}
