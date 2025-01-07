import { useState, useEffect } from 'react';
import { shape } from 'prop-types';

import LoadingIndicator from '~/components/LoadingIndicator';

import Predictions from './components/Predictions';
import Stages from './components/Stages';

import { fetchStagesData, fetchPredictionsData } from './api';

const StageOverviewFeedItem = ({ feedItem }) => {
  const [predictionsData, setPredictionsData] = useState({});
  const [stagesData, setStagesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const wellId = feedItem.well?.id;
  const stageNumber = feedItem.context?.completion_actual_stage?.data?.stage_number;

  useEffect(() => {
    async function handleFetchData() {
      setIsLoading(true);

      setPredictionsData(await fetchPredictionsData({ wellId, stageNumber }));
      setStagesData(await fetchStagesData({ wellId, stageNumber }));

      setIsLoading(false);
    }
    handleFetchData();
  }, []);

  if (isLoading) return <LoadingIndicator fullscreen={false} />;

  return (
    <>
      <Predictions stages={stagesData} predictionsData={predictionsData} />
      <Stages feedItem={feedItem} stages={stagesData} predictionsData={predictionsData} />
    </>
  );
};

StageOverviewFeedItem.propTypes = {
  feedItem: shape({
    context: shape({
      completion_actual_stage: shape({
        data: shape().isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default StageOverviewFeedItem;
