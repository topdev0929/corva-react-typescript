import { useState, useEffect } from 'react';
import { isDevOrQAEnv } from '@corva/ui/utils/env';
import { socketClient } from '@corva/ui/clients';

import { PROVIDER } from '../api/constants';

const collection = 'subscribe.scorecard';

export function useRecalculateSubscription(assetId: number): any {
  const [data, setData] = useState('');

  useEffect(() => {
    const onDataReceive = ({ data }) => {
      setData(data.result);
    };

    const addUnsubscribe = socketClient.subscribe(
      { provider: isDevOrQAEnv ? PROVIDER.corva : PROVIDER.cop, collection, assetId },
      { onDataReceive }
    );

    return () => {
      addUnsubscribe();
    };
  }, [assetId]);

  return data;
}
