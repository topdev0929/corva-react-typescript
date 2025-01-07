/* eslint-disable react/prop-types */
import { get } from 'lodash';
import { Typography, makeStyles } from '@material-ui/core';

import { SEGMENTS } from '~/constants/segment';

const PAGE_NAME = 'FeedPo';

const useStyles = makeStyles(theme => ({
  rigAndWellContainer: {
    display: 'flex',
    gap: '8px',
    alignItems:'flex-end',
  },
  contentAssetInfo: {
    color: theme.palette.primary.main,
    width: '100%',
    fontSize: 12,
  },
  assetLink: {
    cursor: 'pointer',
    display: 'block',
    padding: '4px 0 0 0',
    fontSize: '12px',
  },
  stageNumber: {
    color: theme.palette.primary.text6,
    fontSize: 12,
  },
}));

const getRigName = feedItem => {
  const isRigBasedItem = !!feedItem.rig;
  return isRigBasedItem ? feedItem.rig?.name : feedItem.well?.parent_asset?.name;
};

const RigAndWell = ({ feedItem }) => {
  const classes = useStyles();
  const isRigBasedItem = !!feedItem.rig;

  const rigName = getRigName(feedItem);

  const wellName = isRigBasedItem ? feedItem.rig?.active_well?.name : feedItem.well?.name;

  const wellId = isRigBasedItem ? feedItem.rig?.active_well?.id : feedItem.well?.id;

  const stageNumber = 
    get(feedItem, ['segment', 0]) === SEGMENTS.COMPLETION &&
      get(feedItem,['context','alert', 'stage_numbers', 0])

  return (
    <div className={classes.rigAndWellContainer}>
      {wellId ? (
        <a
          data-testid={`${PAGE_NAME}_wellLink`}
          className={classes.assetLink}
          onClick={e => e.stopPropagation()}
          href={`/assets/${wellId}/`}
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="body2" className={classes.contentAssetInfo}>
            {rigName} - {wellName}
          </Typography>
        </a>
      ) : (
        <Typography variant="body2" className={classes.contentAssetInfo}>
          {rigName} - No Active Well
        </Typography>
    )}
      {stageNumber && 
      <Typography variant="body2" className={classes.stageNumber}>
        Stage {stageNumber}
      </Typography>}
    </div>);
};

export default RigAndWell;
