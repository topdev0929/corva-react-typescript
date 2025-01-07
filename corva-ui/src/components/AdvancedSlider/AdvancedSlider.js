/* eslint-disable no-lonely-if */
/* eslint-disable no-use-before-define */
import { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Resizable from 're-resizable';
import { withSize } from 'react-sizeme';
import classnames from 'classnames';
import { noop } from 'lodash';

import { useThrottledCallback } from '../shared/useThrottledCallback';
import { Handle } from './Handle';

/*
interface AdvancedSliderProps {
  min: number;
  max: number;
  value: [number, number];
  valueFormatter?: (value: number) => number;
  orientation?: 'vertical' | 'horizontal';
  onChange?: (value: [number, number]) => void;
  onStop?: () => void;
  reversed: boolean;
  handlePosition: 'left' | 'right' | 'top' | 'bottom';
}
*/

const AdvancedSlider = ({
  min,
  max,
  value,
  size,
  orientation,
  valueFormatter,
  displayFormatter,
  editableHandles,
  onChange,
  onStop,
  reversed,
  handlePosition,
  handleClasses,
}) => {
  const classes = useStyles();
  const headRef = useRef(null);
  const tailRef = useRef(null);

  const [head, setHead] = useState(valueFormatter(value?.at(0)));
  const [tail, setTail] = useState(valueFormatter(value?.at(1)));
  const sliderStateOnCapturing = useRef(null); // NOTE: Store slider state on capturing the handle
  const [isHandleCaptured, setIsHandleCaptured] = useState(false); // NOTE: user grabbed slider handle

  // NOTE: Overwrite head/tail values based on props
  useEffect(() => {
    if (!sliderStateOnCapturing.current) {
      setHead(Math.min(valueFormatter(value?.at(0)), valueFormatter(value?.at(1))));
      setTail(Math.max(valueFormatter(value?.at(0)), valueFormatter(value?.at(1))));
    }
  }, [value?.at(0), value?.at(1)]);

  // NOTE: Resize blocks based on values
  useEffect(() => {
    if (orientation === 'horizontal') {
      const headWidth = (size.width / (max - min)) * (head - min);
      const tailWidth = (size.width / (max - min)) * (max - tail);

      headRef.current.updateSize({
        width: !reversed ? headWidth : tailWidth,
        height: size.height,
      });
      tailRef.current.updateSize({
        width: !reversed ? tailWidth : headWidth,
        height: size.height,
      });
    } else if (orientation === 'vertical') {
      const headHeight = (size.height / (max - min)) * (head - min);
      const tailHeight = (size.height / (max - min)) * (max - tail);

      headRef.current.updateSize({
        width: size.width,
        height: !reversed ? headHeight : tailHeight,
      });
      tailRef.current.updateSize({
        width: size.width,
        height: !reversed ? tailHeight : headHeight,
      });
    }
  }, [min, max, head, tail, size.width, size.height, orientation]);

  // NOTE: Add event listener when slider handle is captured
  useEffect(() => {
    if (isHandleCaptured) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isHandleCaptured]);

  const onResize = useThrottledCallback((e, direction, refToElement) => {
    sliderStateOnCapturing.current = 'onResize Event'; // anything

    const elemWidth = refToElement.clientWidth;
    const elemHeight = refToElement.clientHeight;

    let nextHead;
    let nextTail;
    if (direction === 'right') {
      // Horizontal head
      if (!reversed) {
        nextHead = valueFormatter(min + (elemWidth / size.width) * (max - min));
      } else {
        nextTail = valueFormatter(max - (elemWidth / size.width) * (max - min));
      }
    } else if (direction === 'left') {
      // Horizontal tail
      if (!reversed) {
        nextTail = valueFormatter(max - (elemWidth / size.width) * (max - min));
      } else {
        nextHead = valueFormatter(min + (elemWidth / size.width) * (max - min));
      }
    } else if (direction === 'bottom') {
      // Vertical head
      if (!reversed) {
        nextHead = valueFormatter(min + (elemHeight / size.height) * (max - min));
      } else {
        nextTail = valueFormatter(max - (elemHeight / size.height) * (max - min));
      }
    } else if (direction === 'top') {
      // Vertical tail
      if (!reversed) {
        nextTail = valueFormatter(max - (elemHeight / size.height) * (max - min));
      } else {
        nextHead = valueFormatter(min + (elemHeight / size.height) * (max - min));
      }
    }

    nextHead = Math.min(nextHead, tail);
    nextTail = Math.max(nextTail, head);

    setHead(prev => nextHead || prev);
    setTail(prev => nextTail || prev);
    onChange([nextHead || head, nextTail || tail]);
  });

  const onResizeStop = useThrottledCallback((/* e, direction, refToElement, delta */) => {
    sliderStateOnCapturing.current = null;
    onStop();
  });

  // NOTE: Store mouse position and head, tail values. Triggered by onMouseDown and onTouchStart
  const rememberInitialState = (xPos, yPos) => {
    sliderStateOnCapturing.current = {
      xPos,
      yPos,
      head,
      tail,
    };
  };
  const calculateNextState = (xPos, yPos) => {
    if (sliderStateOnCapturing.current) {
      let diffPixel;
      let diffValue;

      // NOTE: Calculate next head, tail values based on mouse move
      if (orientation === 'horizontal') {
        diffPixel = sliderStateOnCapturing.current.xPos - xPos;
        diffValue = (diffPixel / size.width) * (max - min);
      } else if (orientation === 'vertical') {
        diffPixel = sliderStateOnCapturing.current.yPos - yPos;
        diffValue = (diffPixel / size.height) * (max - min);
      }
      const headComputed = sliderStateOnCapturing.current.head - diffValue * (!reversed ? 1 : -1);
      const tailComputed = sliderStateOnCapturing.current.tail - diffValue * (!reversed ? 1 : -1);
      const originalGap = sliderStateOnCapturing.current.tail - sliderStateOnCapturing.current.head;

      let nextHead;
      let nextTail;
      if (headComputed <= min) {
        nextHead = min;
        nextTail = min + originalGap;
      } else if (tailComputed >= max) {
        nextHead = max - originalGap;
        nextTail = max;
      } else {
        nextHead = headComputed;
        nextTail = tailComputed;
      }

      nextHead = valueFormatter(nextHead);
      nextTail = valueFormatter(nextTail);

      setHead(nextHead);
      setTail(nextTail);
      onChange([nextHead, nextTail]);
    }
  };

  // NOTE: Mouse event handlers for the drag handle (middle)
  const onMouseDown = e => {
    rememberInitialState(e.clientX, e.clientY);
    setIsHandleCaptured(true);
  };
  const onMouseMove = useThrottledCallback(e => {
    calculateNextState(e.clientX, e.clientY);
  });
  const onMouseUp = useThrottledCallback(() => {
    sliderStateOnCapturing.current = null;
    setIsHandleCaptured(false);
  });

  // NOTE: Touch event handlers for the drag handle (middle)
  const onTouchStart = e => {
    rememberInitialState(e.touches[0].pageX, e.touches[0].pageY);
    setIsHandleCaptured(true);
  };
  const onTouchMove = useThrottledCallback(e => {
    calculateNextState(e.touches[0].pageX, e.touches[0].pageY);
  });
  const onTouchEnd = useThrottledCallback(() => {
    sliderStateOnCapturing.current = null;
    setIsHandleCaptured(false);
  });

  // NOTE: Callbacks for head/tail input fields
  const onChangeHead = useThrottledCallback(nextHead => {
    setHead(nextHead);
    onChange([nextHead, tail]);
  });
  const onChangeTail = useThrottledCallback(newTail => {
    setTail(newTail);
    onChange([head, newTail]);
  });

  const isSmallGap = useMemo(() => {
    const gap =
      ((tail - head) / (max - min)) * (orientation === 'vertical' ? size.height : size.width);
    return gap < 30;
  }, [min, max, head, tail]);

  const getHandleComponent = placement => {
    const headHandleProps = {
      min,
      max: tail,
      value: head,
      onChange: onChangeHead,
    };
    const tailHandleProps = {
      min: head,
      max,
      value: tail,
      onChange: onChangeTail,
    };

    if (placement === 'head') {
      return (
        <Handle
          placement="head"
          readOnly={!editableHandles}
          displayFormatter={displayFormatter}
          orientation={orientation}
          classes={handleClasses}
          {...(!reversed ? headHandleProps : tailHandleProps)}
        />
      );
    } else if (placement === 'tail') {
      return (
        <Handle
          placement="tail"
          readOnly={!editableHandles}
          displayFormatter={displayFormatter}
          orientation={orientation}
          classes={handleClasses}
          {...(!reversed ? tailHandleProps : headHandleProps)}
        />
      );
    }

    return null;
  };

  return (
    <div className={classes.rootWrapper}>
      <div
        className={classnames(classes.root, {
          [classes.horizontalRoot]: orientation === 'horizontal',
          [classes.verticalRoot]: orientation === 'vertical',
        })}
      >
        <Resizable
          ref={headRef}
          minHeight={0}
          minWidth={0}
          enable={{
            right: orientation === 'horizontal',
            bottom: orientation === 'vertical',
          }}
          handleComponent={{
            right: () => getHandleComponent('head'),
            bottom: () => getHandleComponent('head'),
          }}
          onResize={onResize}
          onResizeStop={onResizeStop}
        />

        <div className={classes.body} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
          {!isSmallGap ? (
            <div className={classes.bodyHandleIcon}>
              <HandleIcon orientation={orientation} />
            </div>
          ) : (
            <div
              className={classnames({
                [classes.horizontalBodyHandle]: orientation === 'horizontal',
                [classes.verticalBodyHandle]: orientation === 'vertical',
                [classes.leftBodyHandle]: handlePosition === 'left',
                [classes.rightBodyHandle]: handlePosition === 'right',
                [classes.topBodyHandle]: handlePosition === 'top',
                [classes.bottomBodyHandle]: handlePosition === 'bottom',
              })}
            >
              <div className={classes.bodyHandle}>
                <HandleIcon orientation="vertical" />
              </div>
            </div>
          )}
        </div>

        <Resizable
          ref={tailRef}
          minHeight={0}
          minWidth={0}
          enable={{
            left: orientation === 'horizontal',
            top: orientation === 'vertical',
          }}
          handleComponent={{
            left: () => getHandleComponent('tail'),
            top: () => getHandleComponent('tail'),
          }}
          onResize={onResize}
          onResizeStop={onResizeStop}
        />
      </div>
    </div>
  );
};

AdvancedSlider.defaultProps = {
  orientation: 'horizontal',
  valueFormatter: Math.floor,
  displayFormatter: value => value,
  onChange: noop,
  onStop: noop,
  reversed: false,
  editableHandles: true,
  handleClasses: {},
};

export default withSize({ monitorWidth: true, monitorHeight: true })(AdvancedSlider);

const HandleIcon = ({ orientation }) => {
  return orientation === 'horizontal' ? (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7.5" y="0.5" width="12" height="1" transform="rotate(90 7.5 0.5)" />
      <rect x="4.5" y="0.5" width="12" height="1" transform="rotate(90 4.5 0.5)" />
      <rect x="1.5" y="0.5" width="12" height="1" transform="rotate(90 1.5 0.5)" />
    </svg>
  ) : (
    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="12" height="1" />
      <rect y="3" width="12" height="1" />
      <rect y="6" width="12" height="1" />
    </svg>
  );
};

const useStyles = makeStyles({
  rootWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
  root: {
    position: 'absolute', // Set this to absolute to prevent sizeme growth
    width: '100%',
    height: '100%',
    zIndex: 100,
    '&:hover $body': {
      background: '#008BA366',
    },
    '&:hover $bodyHandle': {
      visibility: 'visible',
    },
  },
  horizontalRoot: {
    display: 'flex',
    alignItems: 'center',
  },
  verticalRoot: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  body: {
    position: 'relative',
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    background: '#3B3B3B66',
    color: '#BDBDBD',
    '& svg': {
      fill: 'currentColor',
    },
    '&:hover': {
      cursor: 'grab',
      background: '#008BA366',
      color: '#FFFFFF',
    },
    '&:active': {
      cursor: 'grabbing',
    },
    '&:hover $bodyHandleIcon': {
      visibility: 'visible',
    },
  },
  horizontalBodyHandle: {
    position: 'absolute',
    bottom: -24,
  },
  verticalBodyHandle: {
    position: 'absolute',
    left: -24,
  },
  leftBodyHandle: {
    position: 'absolute',
    left: -24,
    right: 'auto',
  },
  rightBodyHandle: {
    position: 'absolute',
    right: -24,
    left: 'auto',
  },
  topBodyHandle: {
    position: 'absolute',
    top: -24,
    bottom: 'auto',
  },
  bottomBodyHandle: {
    position: 'absolute',
    bottom: -24,
    top: 'auto',
  },
  bodyHandle: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#03BCD4',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    visibility: 'hidden',
  },
  bodyHandleIcon: {
    visibility: 'hidden',
  },
});
