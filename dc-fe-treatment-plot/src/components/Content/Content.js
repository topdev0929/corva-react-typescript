import { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';

import { LayoutContext } from '../../context/layoutContext';

const VERTICAL_SIDEBAR_WIDTH_CLOSED = 48;
const VERTICAL_SIDEBAR_WIDTH_OPENED = 235;

const HORIZONTAL_CONTENT_OFFSET = 64;

const getContentWidth = ({ isRealtimeSidebarOpen, isFilterSidebarOpen }, isResponsive) => {
  let sideWidth = VERTICAL_SIDEBAR_WIDTH_CLOSED * 2;
  if (isRealtimeSidebarOpen) {
    sideWidth = sideWidth - VERTICAL_SIDEBAR_WIDTH_CLOSED + VERTICAL_SIDEBAR_WIDTH_OPENED;
  }
  if (isFilterSidebarOpen) {
    sideWidth = sideWidth - VERTICAL_SIDEBAR_WIDTH_CLOSED + VERTICAL_SIDEBAR_WIDTH_OPENED;
  }
  if (isResponsive) sideWidth = 0;

  return `calc(100% - ${sideWidth}px)`;
};

const getContentOffset = ({ rtSidebarHorizontalHeigh }, isResponsive, showRealtimeValues) => {
  const height = showRealtimeValues ? rtSidebarHorizontalHeigh : 0;
  return isResponsive ? `${HORIZONTAL_CONTENT_OFFSET + height}px` : 0;
};

const useStyles = makeStyles(() => ({
  cTpContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
}));

function Content({ children, showRealtimeValues }) {
  const { state, isResponsive } = useContext(LayoutContext);
  const classes = useStyles();

  const contentWidth = getContentWidth(state, isResponsive);
  const contentOffset = getContentOffset(state, isResponsive, showRealtimeValues);

  return (
    <div
      className={classNames(classes.cTpContent, isResponsive && 'tpResponsive')}
      style={{
        width: contentWidth,
        paddingTop: contentOffset,
      }}
    >
      {children}
    </div>
  );
}

Content.propTypes = {
  children: PropTypes.node.isRequired,
  showRealtimeValues: PropTypes.bool,
};

export default memo(Content);
