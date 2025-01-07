import { memo, Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as eChartsLib from 'echarts';
import { bind, clear } from 'size-sensor';
import { debounce, differenceBy, minBy, uniqBy } from 'lodash';
import classNames from 'classnames';

import { withTheme, Chip, Tooltip, makeStyles, withStyles } from '@material-ui/core';
import {
  UnfoldLess as UnfoldLessIcon,
  Edit as EditIcon,
  Replay as ReplayIcon,
} from '@material-ui/icons';

import { Button, IconButton, Modal, Typography } from '@corva/ui/components';
import { setAppViewStorageSettings } from '@corva/ui/clients/clientStorage';

import CounterTooltip from './CounterTooltip';
import tooltipOptions, { getTooltipGraphicBadge } from './tooltipOptions';

import { useAppContext } from '@/context/AppContext';
import { CATEGORIES, EVENT_ID_SEPARATOR, ISIPEvent } from '@/constants';
import { getMinISIPFromChartOptions } from '@/utils/eChartUtils';

import './Chart.css';

const CancelButton = withStyles({ root: { margin: '0 16px 0 auto' } })(Button);

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'rgba(59, 59, 59, 0.9)',
    border: '1px solid #03BCD4',
    boxSizing: 'border-box',
    borderRadius: '4px',
    padding: '8px',
  },
}))(Tooltip);

const StyledButton = withStyles({ root: { height: '36px' } })(Button);
const ClearAllButton = withStyles({ root: { margin: '0 16px 0 auto' } })(StyledButton);
const StyledText = withStyles({ root: { color: '#bdbdbd' } })(Typography.Regular16);

const useStyles = makeStyles({
  counterChip: {
    fontSize: '11px !important',
    lineHeight: '13px !important',
    width: '16px',
    height: '16px',
    '&>*': {
      padding: '0 !important',
    },
  },
});

function getEchartOption(
  grid,
  toolbox,
  dataZoom,
  xAxis,
  yAxis,
  legend,
  series,
  chartHeight,
  showTooltip,
  mobile,
  isAssetViewer
) {
  return {
    animation: false,
    tooltip: tooltipOptions(xAxis, chartHeight, showTooltip, isAssetViewer),
    toolbox,
    dataZoom,
    grid,
    legend,
    xAxis,
    yAxis,
    series,
    graphic: getTooltipGraphicBadge(showTooltip, mobile),
  };
}

const getHighlightedEvents = (instance, isHighlightEnabled, isLive, currentStage) => {
  if (!instance) return;

  const eventsSeries = instance
    .getOption()
    .series.filter(seriesItem => seriesItem.category === CATEGORIES.event);

  const eventSeriesChanges = eventsSeries.map(series => {
    const isLiveStage = isLive && currentStage === series.stageNumber;
    const isHighlighted = !isLiveStage && isHighlightEnabled;

    return {
      id: series.id,
      symbolSize: isHighlighted ? 20 : 16,
      tooltip: {
        show: !isHighlighted,
      },
      silent: isHighlighted,
      itemStyle: {
        normal: {
          borderWidth: isHighlighted ? 6 : 0,
          borderColor: isHighlighted ? 'rgba(3, 188, 212, 0.5)' : 'transparent',
          shadowBlur: isHighlighted ? null : 10,
        },
      },
    };
  });

  return eventSeriesChanges;
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const debouncedFunc = debounce((func, param) => {
  func(param);
}, 1000);

const Chart = props => {
  const {
    grid,
    toolbox,
    dataZoom,
    xAxis,
    yAxis,
    legend,
    series,
    theme,
    hideAxis,
    isLive,
    isMobileMode,
    currentStage,
    showEventsEditor,
    onUpdateEvent,
    onUpdateZoom,
    onClickHideAxisIcon,
    onCancelEdit,
    onSaveEditedData,
    showTooltip,
    settingAssetKey,
  } = props;
  const classes = useStyles();

  const chartContainer = useRef(null);
  const { isAssetViewer } = useAppContext();

  const [eChartInstance, setEchartInstance] = useState(null);
  const [iconStatus, setIconStatus] = useState({ isZoomingIn: false, isEditing: false });
  const [resizeToken, setResizeToken] = useState(0);
  const [zoom, setZoom] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  function handleDragging(instance, seriesId, targetDataIndex) {
    const eventsSeries = instance
      .getOption()
      .series.filter(seriesItem => seriesItem.category === CATEGORIES.event);

    const targetSeriesItem = eventsSeries.find(item => item.id === seriesId);

    const { data } = targetSeriesItem;

    const newDataItem = instance.convertFromPixel({ seriesId }, this.position);
    const newData = data.map((dataItem, dataItemIndex) => {
      return dataItemIndex === targetDataIndex ? newDataItem : dataItem;
    });

    instance.setOption({
      series: [
        {
          id: seriesId,
          data: newData,
          symbolSize: 24,
          itemStyle: {
            normal: {
              borderWidth: 8,
              borderColor: 'rgba(3, 188, 212, 0.8)',
              shadowBlur: null,
            },
          },
        },
      ],
    });
  }

  function handleDragEnd(instance, seriesId, targetDataIndex) {
    const mainSeries = instance
      .getOption()
      .series.filter(seriesItem => seriesItem.category === CATEGORIES.main);
    const targetDataItem = instance.convertFromPixel({ seriesId }, this.position);
    const meta = seriesId.split(EVENT_ID_SEPARATOR);
    const assetId = parseInt(meta[0], 10);
    const stageNumber = parseInt(meta[2], 10);
    const eventName = meta[4];

    const eventsSeries = instance
      .getOption()
      .series.filter(seriesItem => seriesItem.category === CATEGORIES.event);
    const targetSeriesItem = eventsSeries.find(item => item.id === seriesId);
    const { data } = targetSeriesItem;

    const refId = meta[meta.length - 1];
    let refSeriesItem = mainSeries.find(item => item.id === refId);
    if (!refSeriesItem) {
      // fallback with color
      const refIdWithoutColor = refId.split('#')[0];
      refSeriesItem = mainSeries.find(item => item.id.startsWith(refIdWithoutColor));
    }
    let refDataItem = minBy(refSeriesItem.data, item => Math.abs(item[0] - targetDataItem[0]));
    let returnToThePreviousValue = false;
    if (eventName === ISIPEvent.name && data.length > 1) {
      const isipMin = getMinISIPFromChartOptions(targetSeriesItem, instance);
      returnToThePreviousValue = isipMin && refDataItem[0] < isipMin;
    }

    onUpdateEvent(
      assetId,
      stageNumber,
      eventName,
      refSeriesItem.refTimestamp,
      refDataItem,
      targetDataIndex,
      returnToThePreviousValue
    );
  }

  const getDraggables = (instance, ignore = false) => {
    const eventsSeries = instance
      .getOption()
      .series.filter(
        seriesItem =>
          seriesItem.category === CATEGORIES.event &&
          !(isLive && seriesItem.stageNumber === currentStage)
      );
    let draggables = [];

    eventsSeries.forEach(seriesItem => {
      const { id, data } = seriesItem;

      const seriesDraggables = data.map((dataItem, dataIndex) => {
        const position = instance.convertToPixel({ seriesId: id }, dataItem);
        return {
          id: `${id}--${dataIndex}--draggable`,
          type: 'circle',
          shape: {
            cx: 0,
            cy: 0,
            r: 8,
          },
          z: 100,
          zlevel: 100,
          position,
          ignore,
          draggable: true,
          invisible: true,
          ondrag: eChartsLib.util.curry(handleDragging, instance, id, dataIndex),
          ondragend: eChartsLib.util.curry(handleDragEnd, instance, id, dataIndex),
        };
      });

      draggables = draggables.concat(seriesDraggables);
    });

    return draggables;
  };

  const updateDraggables = () => {
    if (iconStatus.isEditing) {
      const eventSeriesChanges = getHighlightedEvents(
        eChartInstance,
        iconStatus.isEditing,
        isLive,
        currentStage
      );
      eChartInstance.setOption({
        graphic: getDraggables(eChartInstance),
        series: eventSeriesChanges,
      });
    }
  };

  const handleClickEdit = () => {
    const ignoreDraggables = iconStatus.isEditing;
    const eventSeriesChanges = getHighlightedEvents(
      eChartInstance,
      !iconStatus.isEditing,
      isLive,
      currentStage
    );

    eChartInstance.setOption({
      graphic: getDraggables(eChartInstance, ignoreDraggables),
      series: eventSeriesChanges,
      grid: {
        borderWidth: ignoreDraggables ? 0 : 2,
        borderColor: ignoreDraggables ? '#414141' : '#03BCD4',
        backgroundColor: ignoreDraggables ? 'transparent' : 'rgba(3, 188, 212, 0.03)',
      },
    });

    eChartInstance.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      dataZoomSelectActive: ignoreDraggables,
    });

    setIconStatus({
      isEditing: !iconStatus.isEditing,
      isZoomingIn: false,
    });
  };

  const handleClickCancelButton = () => {
    handleClickEdit();
    onCancelEdit();
  };

  const handleSaveEvents = () => {
    setOpenEditDialog(false);
    handleClickEdit();
    onSaveEditedData();
  };

  const handleClickRestore = () => {
    if (!zoom) return;
    eChartInstance.dispatchAction({
      type: 'restore',
    });

    eChartInstance.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      dataZoomSelectActive: !iconStatus.isEditing,
    });

    setZoom(null);
  };

  const handleZoom = e => {
    if (!e.batch || !e.batch.length) {
      return;
    }

    const { startValue, endValue } = e.batch[0];

    if (!startValue || !endValue) {
      setZoom(null);
    } else {
      setZoom({ startValue, endValue });
    }
  };

  useEffect(() => {
    if (!chartContainer.current) {
      return null;
    }

    const instance = eChartsLib.init(chartContainer.current, theme);

    bind(chartContainer.current, () => {
      instance.resize();

      // Note: This is a hack. https://github.com/facebook/react/issues/14042
      // When a chart is resize, it needs to call updateDraggables which rely on isEditing state
      // When calling updateDraggables inside this callback, isEditing is always false(initial)
      // Workaround is to use other helper state(resizeToken) and useEffect(relying on resizeToken),
      // To prevent setResizeToken from calling so frequently, it uses debounce technique
      debouncedFunc(setResizeToken, Math.random());
    });
    instance.setOption(
      getEchartOption(
        grid,
        toolbox,
        dataZoom,
        xAxis,
        yAxis,
        { ...legend },
        series,
        chartContainer.current.clientHeight,
        showTooltip,
        isMobileMode,
        isAssetViewer
      )
    );

    instance.on('datazoom', handleZoom);

    instance.on('legendselectchanged', e => {
      setAppViewStorageSettings(settingAssetKey, e.selected);
    });

    instance.on('mousemove', params => {
      if (params.componentSubType === 'scatter') {
        instance.getZr().setCursorStyle('default');
      }
    });

    instance.on('globalout', () => {
      instance.setOption({
        tooltip: {
          alwaysShowContent: false,
        },
      });
    });

    instance.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      dataZoomSelectActive: !iconStatus.isEditing,
    });

    setEchartInstance(instance);

    return () => {
      if (chartContainer.current) {
        instance.dispose();
        clear(chartContainer.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateDraggables();
  }, [resizeToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const prevConfig = usePrevious({ grid, toolbox, dataZoom, xAxis, yAxis, legend, series });

  useEffect(() => {
    if (!eChartInstance) {
      return;
    }

    const changes = {};
    let shouldNotMerge = false;

    let notMerge =
      differenceBy(prevConfig.yAxis, yAxis, 'name').length > 0 ||
      prevConfig.series.length !== series.length;

    for (let i = 0; i < series.length; i++) {
      if (series[i]?.color && series[i]?.color !== prevConfig.series[i]?.color) {
        notMerge = true;
        break;
      }
    }

    if (prevConfig.grid !== grid) {
      changes.grid = grid;
      shouldNotMerge = true;
    }

    if (prevConfig.toolbox !== toolbox) {
      changes.toolbox = toolbox;
      shouldNotMerge = true;
    }

    if (prevConfig.dataZoom !== dataZoom) {
      changes.dataZoom = dataZoom;
      shouldNotMerge = true;
    }

    if (prevConfig.legend !== legend) {
      changes.legend = legend;
      shouldNotMerge = true;
    }

    if (prevConfig.xAxis !== xAxis) {
      changes.xAxis = xAxis;
      shouldNotMerge = true;
    }

    if (prevConfig.yAxis !== yAxis) {
      changes.yAxis = yAxis;
      shouldNotMerge = true;
    }

    if (prevConfig.series !== series) {
      changes.series = shouldNotMerge ? series : series.filter(item => item.hasUpdate);
    }

    if (notMerge) {
      changes.animation = false;
    }

    eChartInstance.setOption(changes, { notMerge });
    eChartInstance.setOption({
      tooltip: tooltipOptions(
        xAxis,
        chartContainer.current.clientHeight,
        showTooltip,
        isAssetViewer
      ),
      graphic: getTooltipGraphicBadge(showTooltip, isMobileMode),
    });
    updateDraggables();

    eChartInstance.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      dataZoomSelectActive: !iconStatus.isEditing,
    });
  }, [grid, xAxis, yAxis, legend, series, showTooltip, isMobileMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onUpdateZoom(zoom);
    updateDraggables();
  }, [zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  const iconContainerStyle = {
    left: `${grid.left + 5}px`,
    top: `${grid.top + 20}px`,
  };

  const eventActionsContainerStyle = {
    position: 'absolute',
    right: `${grid.right + 8 + (isLive ? 76 : 0)}px`,
    top: `${grid.top + 22}px`,
  };

  const showHideIconClass = classNames('tpChartIcon', 'showHideAxisIcon');
  const editIconClass = classNames('tpChartIcon', {
    tpChartActiveIcon: iconStatus.isEditing,
  });
  const seriesCounts = yAxis
    .map((axis, axisIndex) => {
      return {
        id: axis.id,
        name: axis.name,
        offset: axis.offset,
        position: axis.position,
        nameGap: axis.nameGap,
        series: uniqBy(
          series.filter(item => item.yAxisIndex === axisIndex && item.category === CATEGORIES.main),
          'name'
        ),
      };
    })
    .filter(item => item.series.length > 1);

  return (
    <Fragment>
      <div className="tpChart" ref={chartContainer} />
      <div className="tpChartIcons" style={iconContainerStyle}>
        {!isMobileMode && (
          <>
            <IconButton
              size="small"
              aria-label="edit"
              tooltipProps={{ title: hideAxis ? 'Show Axis' : 'Hide Axis' }}
              className="tpChartIconButton"
              onClick={() => onClickHideAxisIcon(!hideAxis)}
            >
              <UnfoldLessIcon fontSize="small" className={showHideIconClass} />
            </IconButton>
            {!iconStatus.isEditing && showEventsEditor && (
              <IconButton
                size="small"
                aria-label="edit"
                tooltipProps={{ title: 'Edit Events' }}
                className="tpChartIconButton"
                onClick={handleClickEdit}
              >
                <EditIcon fontSize="small" className={editIconClass} />
              </IconButton>
            )}
          </>
        )}
        {zoom && (
          <Button
            size="small"
            startIcon={<ReplayIcon fontSize="small" className="tpChartIcon" />}
            onClick={handleClickRestore}
            className="tpChartResetButton"
          >
            Reset Zoom
          </Button>
        )}
      </div>
      {iconStatus.isEditing && (
        <div style={eventActionsContainerStyle}>
          <CancelButton color="primary" size="small" onClick={handleClickCancelButton}>
            Cancel
          </CancelButton>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setOpenEditDialog(true)}
          >
            Save
          </Button>
        </div>
      )}
      {seriesCounts.map(item => (
        <StyledTooltip key={item.id} title={<CounterTooltip series={item.series} />}>
          <Chip
            label={item.series.length}
            onClick={() => {}}
            className={classes.counterChip}
            style={{
              position: 'absolute',
              top: `${grid.top + 8}px`,
              [item.position]: `${grid[item.position] - item.offset - item.nameGap - 8}px`,
            }}
          />
        </StyledTooltip>
      ))}
      {openEditDialog && (
        <Modal
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          title="Edit Events?"
          isCloseIconShowed
          actions={
            <>
              <ClearAllButton color="primary" onClick={() => setOpenEditDialog(false)}>
                Cancel
              </ClearAllButton>

              <StyledButton variant="contained" color="primary" onClick={handleSaveEvents}>
                Continue
              </StyledButton>
            </>
          }
        >
          <div style={{ width: '300px', color: '#bdbdbd' }}>
            <StyledText>
              Existing events and activities data will be overwritten. You can&apos;t undo this
              action.
            </StyledText>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

Chart.propTypes = {
  currentStage: PropTypes.number,
  theme: PropTypes.shape({}).isRequired,
  grid: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }).isRequired,
  toolbox: PropTypes.shape({}).isRequired,
  dataZoom: PropTypes.shape([]).isRequired,
  xAxis: PropTypes.shape({}).isRequired,
  yAxis: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  legend: PropTypes.shape({}).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
    })
  ).isRequired,
  hideAxis: PropTypes.bool.isRequired,
  isLive: PropTypes.bool.isRequired,
  showEventsEditor: PropTypes.bool.isRequired,
  isMobileMode: PropTypes.bool.isRequired,
  settingAssetKey: PropTypes.string.isRequired,
  showTooltip: PropTypes.bool,
  onClickHideAxisIcon: PropTypes.func.isRequired,
  onUpdateEvent: PropTypes.func.isRequired,
  onUpdateZoom: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  onSaveEditedData: PropTypes.func.isRequired,
};

Chart.defaultProps = {
  showTooltip: true,
};

export default withTheme(memo(Chart));
