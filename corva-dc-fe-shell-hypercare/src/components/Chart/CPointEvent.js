import { useState } from 'react';
import classnames from 'classnames';
import { upperCase } from 'lodash';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import { POINT_WIDTH } from '~/constants';

const useStyles = makeStyles({
  criticalPointOuter: {
    position: 'absolute',
    marginLeft: '3px',
    marginTop: '3px',
    width: `${POINT_WIDTH - 6}px !important`,
    height: `${POINT_WIDTH - 6}px !important`,
    cursor: 'pointer',
    zIndex: 9,
  },
  criticalPoint: {
    width: `${POINT_WIDTH - 12}px`,
    height: `${POINT_WIDTH - 12}px`,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 500,
    userSelect: 'none',
  },
  outer: {
    width: `${POINT_WIDTH}px !important`,
    height: `${POINT_WIDTH}px !important`,
    marginLeft: 0,
    marginTop: 0,
  },
});

function CPointEvent({ initPoint, clientRect, onUpdatePoint }) {
  const classes = useStyles();
  const point = {
    ...initPoint,
    left: initPoint.left - POINT_WIDTH / 2,
    top: initPoint.top - POINT_WIDTH / 2,
  };
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = event => {
    if (isDragging) {
      const x = event.clientX - clientRect.left - POINT_WIDTH / 2;
      const y = event.clientY - clientRect.top - POINT_WIDTH / 2;
      const deltaX = x - startPosition.x;
      const deltaY = y - startPosition.y;

      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });

      setStartPosition({ x, y });
    }
  };

  const handleMouseUp = async () => {
    if (isDragging) {
      await onUpdatePoint(point.id, {
        x: position.x + POINT_WIDTH / 2,
        y: position.y + POINT_WIDTH / 2,
      });
      setIsDragging(false);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    const x = point.left;
    const y = point.top;
    setStartPosition({ x, y });
    setPosition({ x, y });
  };

  return (
    <div
      className={classnames(classes.criticalPointOuter, classes.criticalPoint, classes.outer)}
      style={{
        top: isDragging ? position.y : point.top,
        left: isDragging ? position.x : point.left,
        background: `${point.color}80`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className={classes.criticalPoint} style={{ background: point.color }}>
        {upperCase(point.title[0])}
      </div>
    </div>
  );
}

CPointEvent.propTypes = {
  initPoint: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
  }).isRequired,
  clientRect: PropTypes.shape({ left: PropTypes.number, top: PropTypes.number }).isRequired,
  onUpdatePoint: PropTypes.func.isRequired,
};

export default CPointEvent;
