import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import get from 'lodash/get';

import { jsonApi } from '@corva/ui/clients';
import { getAppId } from '~/api/appInfo';

const FeedCreationContext = createContext();

const FeedCreationProvider = ({ children, assetId, app }) => {
  const [isFeedCreationMode, setIsFeedCreationMode] = useState(false);
  const [newFeedFields, setNewFeedFields] = useState(null);
  const [feedLoadTimestamp, setFeedLoadTimestamp] = useState(Date.now());

  const exitFeedCreationMode = useCallback(() => {
    setNewFeedFields(null);
    setIsFeedCreationMode(null);
  }, []);

  const createNewFeed = useCallback(
    async ({ body, attachment, timestamp }) => {
      const appId = await getAppId({ app_key: get(app, ['app', 'app_key']) });
      const annotation = {
        app_id: appId,
        asset_id: assetId,
        body,
        attachment: {
          file_name: attachment && attachment.name,
          s3_link: attachment && attachment.url,
        },
        data_timestamp: moment.unix(timestamp).format(),
        settings: get(app, 'settings'),
      };
      const options = {
        dashboard_type: 'asset',
      };
      try {
        await jsonApi.postAnnotation(annotation, options);
        setFeedLoadTimestamp(Date.now());
      } catch (error) {
        console.error(error);
      }

      exitFeedCreationMode();
    },
    [assetId, exitFeedCreationMode]
  );

  const contextValues = useMemo(() => {
    return {
      isFeedCreationMode,
      newFeedFields,
      setIsFeedCreationMode,
      setNewFeedFields,
      exitFeedCreationMode,
      createNewFeed,
      feedLoadTimestamp,
    };
  }, [isFeedCreationMode, newFeedFields, exitFeedCreationMode, createNewFeed, feedLoadTimestamp]);

  return (
    <FeedCreationContext.Provider value={contextValues}>{children}</FeedCreationContext.Provider>
  );
};

FeedCreationProvider.propTypes = {
  app: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
  assetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default FeedCreationProvider;

export function useFeedCreationProvider() {
  return useContext(FeedCreationContext);
}
