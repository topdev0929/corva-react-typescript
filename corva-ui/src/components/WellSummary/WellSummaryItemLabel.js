import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import classnames from 'classnames';

import { isMobileDetected } from '~/utils/mobileDetect';

const ICON_HEIGHT = 16;

const useStyles = makeStyles({
  labelRoot: {
    display: 'flex',
    alignItems: 'flex-start',
    height: ({ isMobile }) => !isMobile && ICON_HEIGHT,
  },
  croppedRoot: {
    overflow: 'hidden',
    marginRight: '10px',
    '& $label': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  labelIcon: {
    width: ICON_HEIGHT,
    height: ICON_HEIGHT,
    minWidth: ICON_HEIGHT,
    minHeight: ICON_HEIGHT,
    marginRight: '8px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  label: {
    color: '#9E9E9E',
    fontSize: '14px',
    lineHeight: '16px',
  },
});

function WellSummaryItemLabel({ item, textShrinked }) {
  const classes = useStyles({ isMobile: isMobileDetected });

  return (
    <div className={classnames(classes.labelRoot, { [classes.croppedRoot]: textShrinked })}>
      {item.icon && (
        <div className={classes.labelIcon} style={{ backgroundImage: `url(${item.icon})` }} />
      )}
      <Typography className={classes.label}>{item.label}:</Typography>
    </div>
  );
}

WellSummaryItemLabel.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.node,
  }).isRequired,
  textShrinked: PropTypes.bool,
};

WellSummaryItemLabel.defaultProps = {
  textShrinked: false,
};

export default WellSummaryItemLabel;
