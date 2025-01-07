import { useRef, useEffect, useState, useMemo } from 'react';
import { withSize } from 'react-sizeme';
import classNames from 'classnames';
import ReactCursorPosition from 'react-cursor-position';
import Draggable from 'react-draggable';
import { get, sortBy, noop, clamp, find, omit, reject } from 'lodash';
import tinygradient from 'tinygradient';
import { v4 as uuidv4 } from 'uuid';
import { Typography, Popover, IconButton, Tooltip, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';

import { GradientFillStop } from '~/types';
import PaletteChromePicker from '../ColorPicker/PaletteChromePicker';
import { calcGradientStyle, getRangeStep, getStopText, roundToStep } from './GradientPicker.utils';
import { GradientPickerComponentProps } from './GradientPickerProps';
import { useThrottledCallback } from '../shared/useThrottledCallback';
import { useStyles } from './GradientPicker.styles';

const DRAG_TOP_LIMIT = -50;
const DRAG_BOTTOM_LIMIT = 40;
const DRAG_OFFSET_X = 12;
const DRAG_OFFSET_Y = -4;

const GradientPickerComponent: React.FC<GradientPickerComponentProps> = ({
  size,
  from = 0,
  to = 100,
  unit,
  gradientStops,
  onChange,
  style,
  isMoveInputVisible,
  readonly,
  noScale,
  'data-testid': PAGE_NAME = 'GradientPicker',
}) => {
  const trackRef: React.MutableRefObject<HTMLDivElement> = useRef();

  const [stops, setStops] = useState<Array<GradientFillStop & { id: string }>>([]);

  const [paletteAnchorEl, setPaletteAnchorEl] = useState(null);
  const [activeStopId, setActiveStopId] = useState(null);
  const [addCirclePos, setAddCirclePos] = useState(null);

  const classes = useStyles({ readonly });

  const fromValue = Number.isFinite(from) ? Number(from) : 0;
  const toValue = Number.isFinite(to) ? Number(to) : 100;
  const range = toValue - fromValue;

  useEffect(() => {
    const changed =
      gradientStops.length !== stops?.length ||
      gradientStops.some(
        (stop, index) => stop.color !== stops[index].color || stop.pos !== stops[index].pos
      );

    if (changed) {
      setStops(gradientStops.map(stop => ({ ...stop, id: uuidv4() })));
    }
  }, [gradientStops]);

  const gradient = useMemo(() => calcGradientStyle(stops), [stops]);
  const containerWidth = useMemo(
    () => trackRef.current?.clientWidth,
    [size.width, trackRef.current]
  );

  const emitChange = (stops: Array<GradientFillStop & { id: string }>) => {
    const sorted = sortBy(stops, 'pos');
    setStops(sorted);
    if (onChange) {
      onChange(sorted.map(stop => omit(stop, 'id')));
    }
  };

  const onPositionChanged = cursorInfo => {
    setAddCirclePos(
      get(cursorInfo, 'isPositionOutside', true) ? null : get(cursorInfo, 'position.x', null)
    );
  };

  /**
   * When a user clicks a stop the "startDrag" and "click" events are fired simultaneously.
   * So useThrottledCallback (or any other scheduler, like setTimeout) solves
   * this conflict by waiting a tick and allowing the palette to open.
   * Then if it was a click and palette is open - do not initiate drag-n-drop.
   */
  const handleDragMove = useThrottledCallback(
    (id: string, xPos: number, yPos: number, isStopped = false) => {
      if (paletteAnchorEl) {
        return;
      }
      const pos = (xPos / containerWidth) * 100;
      const stop = find(stops, { id });
      if (yPos >= DRAG_BOTTOM_LIMIT || yPos <= DRAG_TOP_LIMIT) {
        handleRemoveStop();
        return;
      }

      const currentStop = { ...stop, pos };

      const newStops = sortBy([...reject(stops, { id }), currentStop], 'pos');

      if (isStopped) {
        emitChange(newStops);
        setActiveStopId(null);
        return;
      }

      setStops(newStops);
      if (!activeStop) {
        setActiveStopId(id);
      }
    },
    0
  );

  const handleAdd = () => {
    const pos = (addCirclePos / containerWidth) * 100;
    const gradient = tinygradient(
      stops.map(item => ({
        color: item.color,
        pos: item.pos / 100,
      }))
    );

    const color = `#${gradient.rgbAt(pos / 100).toHex()}`;
    const newStop = { id: uuidv4(), pos, color };
    emitChange([...stops, newStop]);
  };

  const handleColorPickerOpen = (e: React.MouseEvent, id) => {
    if (readonly || activeStopId) {
      return;
    }
    setActiveStopId(id);
    setPaletteAnchorEl(e.currentTarget);
  };

  const handleColorPickerClose = () => {
    emitChange(stops);
    setActiveStopId(null);
    setPaletteAnchorEl(null);
  };

  const handleStopPositionTextInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // give React a moment to update state and draw input with a zero and select the zero
    // to allow user type a new value
    if (evt.target.value === '') {
      const inputElement = evt.target;
      setTimeout(() => inputElement?.select());
    }
    const posScaled = clamp(Number(evt.target.value), fromValue, toValue);
    if (!posScaled) {
      evt.target.select();
    }
    const pos = ((posScaled - fromValue) / range) * 100;
    setStops(stops.map(stop => (stop.id === activeStopId ? { ...stop, pos } : stop)));
  };

  const handleColorChange = newColor => {
    const color = newColor.hex;
    setStops(stops.map(stop => (stop.id === activeStopId ? { ...stop, color } : stop)));
  };

  const handleRemoveStop = () => {
    if (stops.length > 2) {
      emitChange(reject(stops, { id: activeStopId }));
      setPaletteAnchorEl(null);
      setActiveStopId(null);
    }
  };

  const getStopTooltipValue = (position: number) => {
    return getStopText(position, { fromValue, toValue });
  };

  const addCircleVisible = !paletteAnchorEl && Number.isFinite(addCirclePos) && !readonly;

  const getStopScaledPosition = activeStop => {
    if (!activeStop) {
      return null;
    }
    const stopValue = fromValue + (activeStop?.pos / 100) * range;
    return roundToStep(stopValue, stopStep / 100);
  };

  const activeStop = find(stops, { id: activeStopId });
  const stopStep = getRangeStep(range);

  const activeStopScaledPos = getStopScaledPosition(activeStop);

  return (
    <div className={classes.root} style={style}>
      {!noScale && (
        <div className={classes.indicatorContainer}>
          <div>
            <Typography data-testid={`${PAGE_NAME}_from`} className={classes.indicator}>
              {fromValue} {unit}
            </Typography>
          </div>
          <div>
            <Typography data-testid={`${PAGE_NAME}_to`} className={classes.indicator}>
              {toValue} {unit}
            </Typography>
          </div>
        </div>
      )}

      <ReactCursorPosition onPositionChanged={onPositionChanged}>
        <div
          data-testid={`${PAGE_NAME}_track`}
          className={classes.mainBar}
          style={{ background: `linear-gradient(90deg, ${gradient})` }}
          ref={trackRef}
        >
          {addCircleVisible && (
            <div
              data-testid={`${PAGE_NAME}_addCircle`}
              className={classes.addCircle}
              style={{ left: addCirclePos - DRAG_OFFSET_X }}
              onClick={handleAdd}
            >
              <Add fontSize="small" className={classes.addIcon} />
            </div>
          )}

          {containerWidth &&
            stops.map(({ pos, color, id }, index) => (
              // @ts-ignore Draggable propTypes issues
              <Draggable
                disabled={readonly}
                key={id}
                axis="x"
                bounds={{
                  left: -DRAG_OFFSET_X,
                  right: containerWidth - DRAG_OFFSET_X,
                  top: DRAG_TOP_LIMIT,
                  bottom: DRAG_BOTTOM_LIMIT,
                }}
                onDrag={(e, dragData) =>
                  handleDragMove(id, dragData.x + DRAG_OFFSET_X, dragData.y, false)
                }
                onStop={(e, dragData) =>
                  handleDragMove(id, dragData.x + DRAG_OFFSET_X, dragData.y, true)
                }
                position={{
                  x: (containerWidth * pos) / 100 - DRAG_OFFSET_X,
                  y: DRAG_OFFSET_Y,
                }}
              >
                <div
                  onClick={e => handleColorPickerOpen(e, id)}
                  data-testid={`${PAGE_NAME}_stop_${index}`}
                  className={classNames(classes.circle, {
                    highlight: activeStopId === id,
                  })}
                  style={{ backgroundColor: color }}
                >
                  <Tooltip title={getStopTooltipValue(pos)} placement="top">
                    <div style={{ height: '100%' }} />
                  </Tooltip>
                </div>
              </Draggable>
            ))}
        </div>
      </ReactCursorPosition>

      {Boolean(paletteAnchorEl) && (
        <Popover
          id="colors-popper"
          open={Boolean(paletteAnchorEl)}
          anchorEl={paletteAnchorEl}
          onClose={handleColorPickerClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <PaletteChromePicker
            color={activeStop?.color}
            onChange={handleColorChange}
            onSizeChange={noop}
            enableTransparencyPalette={false}
          />
          <IconButton
            data-testid={`${PAGE_NAME}_stopDelete`}
            className={classes.removeButton}
            onClick={handleRemoveStop}
          >
            <DeleteIcon className={classes.deleteIcon} />
          </IconButton>
          {isMoveInputVisible && (
            <TextField
              data-testid={`${PAGE_NAME}_moveInput`}
              type="number"
              variant="outlined"
              value={activeStopScaledPos}
              classes={{ root: classes.posTextfield }}
              InputProps={{
                inputProps: {
                  min: fromValue,
                  max: toValue,
                  step: stopStep,
                  maxlength: 10,
                },
                classes: {
                  root: classes.posOutlinedRoot,
                  input: classes.posOutlinedInput,
                },
              }}
              autoFocus
              onFocus={evt => evt.target.select()}
              onChange={handleStopPositionTextInput}
              onKeyDown={evt => evt.key === 'Enter' && handleColorPickerClose()}
            />
          )}
        </Popover>
      )}
    </div>
  );
};

export const GradientPicker = withSize()(GradientPickerComponent);
