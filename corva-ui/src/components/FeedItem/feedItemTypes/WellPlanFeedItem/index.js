import { useEffect } from 'react';
import { shape, number, func, string } from 'prop-types';
import { Map, List } from 'immutable';

import { EmbeddedApp } from '~/components/EmbeddedApp';

import { DEFAULT_SUBSCRIPTION_META } from '~/constants/subscriptions';

import TargetChanges from './components/TargetChanges';
import VerticalSectionAzimuth from './components/VerticalSectionAzimuth';
import { SUBSCRIPTIONS } from './constants';

import styles from './styles.css';

const WellPlanFeedItem = ({
  feedItem: {
    id,
    well,
    context: {
      well_plan: {
        data: { vertical_section_azimuth: vsa, target_changes: targetChanges },
        timestamp,
      },
    },
  },
  subscribeAppForAsset,
  unsubscribeAppFromAsset,
  appContext,
  isSubDataLoading,
  getSubErrors,
  isSubDataEmpty,
  appRegistry,
  appData,
}) => {
  // Note: Using custom subscription here instead of embedded app component sub,
  // because in this component we have 2 apps with same data, we don't want to load
  // data twice;

  const subscriptions = SUBSCRIPTIONS.map(sub => ({
    ...sub,
    meta: { ...DEFAULT_SUBSCRIPTION_META, subscribeOnlyForInitialData: true },
  }));

  useEffect(() => {
    function subscribeAppForData() {
      subscribeAppForAsset(id, subscriptions, well.id, { query: `{timestamp#lte#${timestamp}}` });

      return () => {
        unsubscribeAppFromAsset(id, subscriptions);
      };
    }

    if (well && timestamp) subscribeAppForData();
  }, []);

  if (!well) return 'No Well in data';

  return (
    <>
      <div className={styles.wellPlanFeedItemInfo}>
        <VerticalSectionAzimuth vsa={vsa} />
        {targetChanges && <TargetChanges targetChanges={targetChanges} />}
      </div>
      <EmbeddedApp
        asset={Map(well)}
        appContainerClassName={styles.wellPlanFeedItemApp}
        appId={id}
        assetId={well.id}
        appComponentKey="directional-wellPlan"
        appComponentCategory="directional"
        subscriptions={subscriptions}
        requiresSubscription={false}
        appContext={Map(appContext)}
        assetDashboards={List()}
        graphType={1}
        internalSelectors={{
          isSubDataLoading,
          getSubErrors,
          isSubDataEmpty,
        }}
        appRegistry={appRegistry}
        appData={appData}
        subscribeAppForAsset={subscribeAppForAsset}
        unsubscribeAppFromAsset={unsubscribeAppFromAsset}
      />
      <EmbeddedApp
        asset={Map(well)}
        appContainerClassName={styles.wellPlanFeedItemApp}
        appId={id}
        assetId={well.id}
        appComponentKey="directional-wellPlan"
        appComponentCategory="directional"
        subscriptions={subscriptions}
        requiresSubscription={false}
        appContext={Map(appContext)}
        assetDashboards={List()}
        graphType={2}
        internalSelectors={{
          isSubDataLoading,
          getSubErrors,
          isSubDataEmpty,
        }}
        appRegistry={appRegistry}
        appData={appData}
        subscribeAppForAsset={subscribeAppForAsset}
        unsubscribeAppFromAsset={unsubscribeAppFromAsset}
      />
    </>
  );
};

WellPlanFeedItem.propTypes = {
  feedItem: shape({
    id: number,
    context: shape({
      well_plan: shape({
        timestamp: number.isRequired,
        data: shape({
          vertical_section_azimuth: number,
          target_changes: shape({
            measured_depth: number,
            tvd_change: number,
            vertical_section: number,
          }),
        }),
      }).isRequired,
    }).isRequired,
    well: shape({
      id: number.isRequired,
    }).isRequired,
  }).isRequired,

  subscribeAppForAsset: func.isRequired,
  unsubscribeAppFromAsset: func.isRequired,
  appContext: shape({
    view: string.isRequired,
  }).isRequired,
  appData: shape().isRequired,
  appRegistry: shape().isRequired,
  isSubDataLoading: func.isRequired,
  getSubErrors: func.isRequired,
  isSubDataEmpty: func.isRequired,
};

export default WellPlanFeedItem;
