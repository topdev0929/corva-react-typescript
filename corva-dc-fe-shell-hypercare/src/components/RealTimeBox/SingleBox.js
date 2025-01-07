import { memo } from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import BoxTopLeftSVG from '~/assets/boxTopLine.svg';
import BoxBottomRightSVG from '~/assets/boxBottomLine.svg';

const useStyles = makeStyles(({ palette }) => ({
  box: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: `${palette.background.b5}CC`,
    cursor: 'pointer',
    width: '170px',
    padding: '8px 8px 8px 12px',
    borderRadius: '8px',
    '& first-child': {
      paddingLeft: 0,
    },
  },
  selected: {
    borderBottom: '0px solid #2c2c2c',
    backgroundColor: '#2c2c2c',
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.5)',
  },
  boxTitle: {
    paddingTop: '2px',
    paddingLeft: '4px',
    fontSize: '12px',
    lineHeight: '12px',
    color: palette.primary.text6,
    maxWidth: '146px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  boxValue: {
    paddingTop: '6px',
    fontSize: '18px',
    lineHeight: '24px',
    color: palette.primary.text1,
    '& span': {
      fontSize: '12px',
      lineHeight: '16px',
      color: palette.primary.text6,
    },
  },
  topLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  bottomRightBorder: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
}));

function SingleBox(props) {
  const { item, itemSelected, color, onClick } = props;
  const classes = useStyles();

  const paramColorStyle = item
    ? {
        borderLeft: `2px solid ${color}`,
      }
    : null;

  if (!item) return null;

  return (
    <div
      className={classNames(classes.box, { [classes.selected]: !!itemSelected })}
      onClick={onClick}
    >
      <img src={BoxTopLeftSVG} alt="top-left-border" className={classes.topLeftBorder} />
      <img
        src={BoxBottomRightSVG}
        alt="bottom-right-border"
        className={classes.bottomRightBorder}
      />
      <div className={classes.boxTitle} style={paramColorStyle}>
        {item.displayName ||
          (item.sensorName
            ? `${startCase(item.traceName)} | ${item.sensorName}`
            : startCase(item.traceName))}
      </div>
      <div className={classes.boxValue}>
        {item.value} <span>{item.unit}</span>
      </div>
    </div>
  );
}

SingleBox.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sensorName: PropTypes.string,
    traceName: PropTypes.string,
    displayName: PropTypes.string,
    color: PropTypes.string,
    unitType: PropTypes.string,
    unit: PropTypes.string,
  }).isRequired,
  itemSelected: PropTypes.bool,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

SingleBox.defaultProps = {
  itemSelected: false,
};

export default memo(SingleBox);
