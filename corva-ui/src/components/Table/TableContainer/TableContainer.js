import { useState } from 'react';
import classname from 'classnames';
import { TableContainer as MUITableContainer, makeStyles } from '@material-ui/core';

const GRADIENT_POSITIONS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  BOTH: 'both',
};

const useStyles = makeStyles(theme => ({
  root: props => ({
    borderTop: props.isStickyHeader ? `1px solid ${theme.palette.primary.text9}` : 'none',
    '& .MuiTable-root .MuiTableHead-root .MuiTableRow-head': {
      position: (props.top || props.bothVertical) && 'sticky',
      zIndex: 2,
      top: 0,
      boxShadow:
        (props.top || props.bothVertical) && `0px 16px 10px ${theme.palette.background.b6}`,
    },
    '& .MuiTable-root .MuiTableFooter-root': {
      '&:before': {
        content: (props.bottom || props.bothVertical) && 'no-open-quote',
        position: 'absolute',
        bottom: -1,
        width: 'inherit',
        height: '16px',
        background: `linear-gradient(360deg, rgba(44, 44, 44, 0) 0%, ${theme.palette.background.b6} 100%)`,
        transform: 'matrix(1, 0, 0, -1, 0, 0)',
      },
    },
    '& .MuiTable-root .MuiTableHead-root .MuiTableRow-head .stickyCell, & .MuiTable-root .MuiTableBody-root .MuiTableRow-root .stickyCell':
      {
        '&:after': {
          content: (props.left || props.bothHorizontal) && 'no-open-quote',
          position: 'absolute',
          top: 0,
          right: '-16px',
          width: '16px',
          height: '100%',
          background: `linear-gradient(270deg, rgba(44, 44, 44, 0) 0%, ${theme.palette.background.b6} 100%)`,
        },
      },
    '& .MuiTable-root .MuiTableHead-root .MuiTableRow-head .stickyEmptyCell, & .MuiTable-root .MuiTableBody-root .MuiTableRow-root .stickyEmptyCell':
      {
        background:
          (props.right || props.bothHorizontal) &&
          `linear-gradient(90deg, rgba(44, 44, 44, 0) 0%, ${theme.palette.background.b6} 100%)`,
      },
  }),
}));

export const TableContainer = props => {
  const { stickyHeader, className, stickyColumn, classes: customClasses, ...restProps } = props;
  const [verticalGradientPosition, setVerticalGradientPosition] = useState(
    stickyHeader ? GRADIENT_POSITIONS.BOTTOM : ''
  );
  const [horizontalGradientPosition, setHorizontalGradientPosition] = useState(
    stickyColumn ? GRADIENT_POSITIONS.RIGHT : ''
  );
  const classes = useStyles({
    top: verticalGradientPosition === GRADIENT_POSITIONS.TOP,
    bottom: verticalGradientPosition === GRADIENT_POSITIONS.BOTTOM,
    bothVertical: verticalGradientPosition === GRADIENT_POSITIONS.BOTH,
    left: horizontalGradientPosition === GRADIENT_POSITIONS.LEFT,
    right: horizontalGradientPosition === GRADIENT_POSITIONS.RIGHT,
    bothHorizontal: horizontalGradientPosition === GRADIENT_POSITIONS.BOTH,
    isStickyHeader: stickyHeader,
  });

  const handleScrollPosition = ({
    scroll,
    clientParam,
    scrollParam,
    setScrollPosition,
    gradientPositions,
  }) => {
    if (scroll === 0) {
      setScrollPosition(gradientPositions[0]);
    } else if (Math.ceil(scroll) + clientParam === scrollParam) {
      setScrollPosition(gradientPositions[1]);
    } else setScrollPosition(GRADIENT_POSITIONS.BOTH);
  };

  const handleTableScroll = e => {
    if (stickyHeader) {
      handleScrollPosition({
        scroll: e.target.scrollTop,
        clientParam: e.target.clientHeight,
        scrollParam: e.target.scrollHeight,
        setScrollPosition: setVerticalGradientPosition,
        gradientPositions: [GRADIENT_POSITIONS.BOTTOM, GRADIENT_POSITIONS.TOP],
      });
    } else if (stickyColumn) {
      handleScrollPosition({
        scroll: e.target.scrollLeft,
        clientParam: e.target.clientWidth,
        scrollParam: e.target.scrollWidth,
        setScrollPosition: setHorizontalGradientPosition,
        gradientPositions: [GRADIENT_POSITIONS.RIGHT, GRADIENT_POSITIONS.LEFT],
      });
    }
  };

  return (
    <MUITableContainer
      onScroll={handleTableScroll}
      className={classname(classes.root, className, customClasses?.root)}
      {...restProps}
    />
  );
};
