import { useEffect, useRef, useState } from 'react';

import { socketClient } from '@corva/ui/clients';
import {
  removeNotification,
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
} from '@corva/ui/utils';
import { postTask } from '@corva/ui/clients/jsonApi';
import { TASK_STATE } from '~/constants';

const HOUR_DURATION = 3600 * 1000;

export function useDownholeTask(provider, assetId, taskStart, fileName, sensorName) {
  const [subscribeData, setSubscribeData] = useState(null);
  const [isSubscriptionStart, setIsSubscriptionStart] = useState(false);
  const notificationId = useRef();

  // Task Start
  useEffect(() => {
    const postDownholeSensorTask = async () => {
      notificationId.current = showInfoNotification('Downhole Sensor Data Ingestion in Progress', {
        autoHideDuration: HOUR_DURATION,
      });

      const task = {
        provider,
        app_key: `${provider}.downhole_sensor_data_ingestion`,
        asset_id: assetId,
        properties: {
          file_name: fileName,
          sensor_name: sensorName,
        },
      };
      postTask({ task });
      setIsSubscriptionStart(true);
    };

    if (taskStart && assetId && fileName && sensorName) {
      postDownholeSensorTask();
    } else {
      setIsSubscriptionStart(false);
    }
  }, [assetId, taskStart, fileName, sensorName]);

  // Subscribe
  useEffect(() => {
    setSubscribeData(null);
    if (!assetId || !isSubscriptionStart) return null;

    const unsubscribe = socketClient.subscribe(
      {
        provider,
        dataset: 'downhole.sensor.task',
        assetId,
      },
      {
        onDataReceive: e => {
          const { file_name: filename, processed, reason } = e.data;
          if (filename === fileName && processed) {
            removeNotification(notificationId.current?.value);
            if (reason) {
              showErrorNotification("There's an error during request. Please try again later.");
              setSubscribeData(TASK_STATE.failed);
            } else {
              showSuccessNotification('The downhole sensor data has been updated successfully');
              setSubscribeData(TASK_STATE.succeeded);
            }
            setIsSubscriptionStart(false);
          }
        },
      }
    );

    return () => {
      unsubscribe();
    };
  }, [assetId, isSubscriptionStart]);

  return subscribeData;
}

export const removeDownholeSensorTask = async (provider, assetId, sensorName) => {
  const task = {
    provider,
    app_key: `${provider}.downhole_sensor_data_ingestion`,
    asset_id: assetId,
    properties: {
      sensor_name: sensorName,
      delete: 1,
    },
  };
  postTask({ task });
};
