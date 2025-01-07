import { useState, useEffect, useCallback } from 'react';

import { sharedDCStore } from '../utils';

export default function useSharedDCStore(storeKey) {
  const [store, setStore] = useState(sharedDCStore.getSharedDCStore(storeKey));

  useEffect(() => {
    const unsubscribeFromStoreFn = sharedDCStore.subscribeForSharedDCStore(storeKey, setStore);

    return unsubscribeFromStoreFn;
  }, []);

  const setHookSharedDCStore = useCallback(
    setterFn => sharedDCStore.setSharedDCStore(storeKey, setterFn),
    [storeKey]
  );

  return [store, setHookSharedDCStore];
}
