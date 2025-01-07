import { useState, useEffect } from 'react';
import { shape, number, string } from 'prop-types';
import { makeStyles } from '@material-ui/core';

import LoadingIndicator from '~/components/LoadingIndicator';

import AccuracyPlan from './components/AccuracyPlan';
import ActualPointInfo from './components/ActualPointInfo';
import Warning from './components/Warning';

import { fetchDirectionalAccuracyRecords } from './api';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

const SurveyStationFeedItem = ({ feedItem }) => {
  const classes = useStyles();

  const [isAccuracyRecordLoaded, setIsAccuracyRecordLoaded] = useState(false);
  const [isAccuracyRecordPresent, setIsAccuracyRecordPresent] = useState(false);
  const [accuracyData, setAccuracyData] = useState(null);
  const [cumulativeTvdChange, setCumulativeTvdChange] = useState('');
  const [initialPlanName, setInitialPlanName] = useState('');
  const [timestamp, setTimestamp] = useState(null);

  const isWellStatusActive = feedItem.context?.survey_station?.well?.status === 'active';

  useEffect(async () => {
    const wellId = feedItem.well?.id;
    const md = feedItem.context?.survey_station?.data?.measured_depth;

    const records = await fetchDirectionalAccuracyRecords({ wellId, md });

    const directionalAccuracyData = records?.[0]?.data;

    setIsAccuracyRecordLoaded(true);

    if (directionalAccuracyData) {
      const accuracyData = directionalAccuracyData.accuracy;
      const cumulativeTvdChange = directionalAccuracyData.cumulative_tvd_change || '';
      const initialPlanName = directionalAccuracyData.plan_name || '';
      const recordTimestamp = records[0]?.timestamp;

      setIsAccuracyRecordPresent(true);
      setAccuracyData(accuracyData);
      setCumulativeTvdChange(cumulativeTvdChange);
      setInitialPlanName(initialPlanName);
      setTimestamp(recordTimestamp);
    }
  }, []);

  if (!isAccuracyRecordLoaded) return <LoadingIndicator />;

  return (
    <div className={classes.wrapper}>
      {isAccuracyRecordPresent ? (
        <AccuracyPlan
          accuracyData={accuracyData}
          cumulativeTvdChange={cumulativeTvdChange}
          initialPlanName={initialPlanName}
          timestamp={timestamp}
        />
      ) : (
        <Warning isWellStatusActive={isWellStatusActive} />
      )}
      <ActualPointInfo feedItem={feedItem} />
    </div>
  );
};

SurveyStationFeedItem.propTypes = {
  feedItem: shape({
    context: shape({
      survey_station: shape({
        data: shape({
          azimuth: number.isRequired,
          inclination: number.isRequired,
          measured_depth: number.isRequired,
        }).isRequired,
        well: shape({
          status: string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default SurveyStationFeedItem;
