import { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import { convertValue } from '~/utils/convert';
import Attachment from '~/components/Attachment';

import CriticalIcon from './icons/Critical';
import MajorIcon from './icons/Major';
import MinorIcon from './icons/Minor';

const PAGE_NAME = 'LessonsLearnedFeedItem';

const useStyles = makeStyles({
  item: {
    marginTop: '4px',
  },
  itemLabel: {
    fontWeight: 'normal',
    fontSize: '14px',
    color: '#BDBDBD',
    marginRight: '8px',
  },
  itemValue: {
    fontSize: '14px',
    color: '#FFFFFF',
  },
  attachment: {
    paddingTop: 10,
    width: 300,
  },
});

function LessonsLearnedFeedItem({ feedItem }) {
  const classes = useStyles();
  const data = useMemo(() => {
    const rawData = feedItem.context?.lessons_learned?.data || {};
    return {
      ...rawData,
      md_start: convertValue(rawData.md_start, 'length', 'ft'),
      tvd_start: convertValue(rawData.tvd_start, 'length', 'ft'),
    };
  }, [feedItem]);
  const attachment = feedItem.context?.lessons_learned.attachment;

  const showSeverityIcon = () => {
    if (data.severity === 'Major') {
      return <MajorIcon />;
    } else if (data.severity === 'Critical') {
      return <CriticalIcon />;
    } else if (data.severity === 'Minor') {
      return <MinorIcon />;
    }

    return null;
  };

  return (
    <div>
      <div className={classes.item}>
        <span data-testid={`${PAGE_NAME}_topic`} className={classes.itemLabel}>
          {data.topic}
        </span>
      </div>
      <div className={classes.item}>
        <span className={classes.itemLabel}>Event Cause:</span>
        <span data-testid={`${PAGE_NAME}_Cause`} className={classes.itemValue}>
          {data.cause}
        </span>
      </div>
      <div className={classes.item} style={{ display: 'flex', alignItems: 'center' }}>
        <span className={classes.itemLabel}>Event Severity:</span>
        <span data-testid={`${PAGE_NAME}_severityIcon`}>{showSeverityIcon()}</span>
        <span data-testid={`${PAGE_NAME}_Severity`} className={classes.itemValue}>
          {data.severity}
        </span>
      </div>
      <div className={classes.item}>
        <span className={classes.itemLabel}>MD/TVD:</span>
        <span data-testid={`${PAGE_NAME}_MD/TVD`} className={classes.itemValue}>
          {Number.isFinite(data.md_start) ? data.md_start.fixFloat(2) : '-'}/
          {Number.isFinite(data.tvd_start) ? data.tvd_start.fixFloat(2) : '-'}
        </span>
      </div>
      <div className={classes.item}>
        <span className={classes.itemLabel}>Hole Section:</span>
        <span data-testid={`${PAGE_NAME}_HoleSection`} className={classes.itemValue}>
          {data.section}
        </span>
      </div>
      <div className={classes.item}>
        <span className={classes.itemLabel}>Operation:</span>
        <span data-testid={`${PAGE_NAME}_Operation`} className={classes.itemValue}>
          {data.activity}
        </span>
      </div>
      <div className={classes.item}>
        <span className={classes.itemLabel}>Description:</span>
        <div data-testid={`${PAGE_NAME}_Description`} className={classes.itemValue}>
          {data.description}
        </div>
      </div>
      {attachment && (attachment.signed_url || attachment.url || attachment.name) && (
        <div className={classes.attachment}>
          <Attachment
            small
            attachmentUrl={attachment.signed_url || attachment.url}
            fileName={attachment.name}
            displayName={attachment.name}
          />
        </div>
      )}
    </div>
  );
}

LessonsLearnedFeedItem.propTypes = {
  feedItem: PropTypes.shape().isRequired,
};

export default memo(LessonsLearnedFeedItem);
