import { useContext, useMemo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { clamp, maxBy, minBy, omit, snakeCase, startCase, trim } from 'lodash';
import classnames from 'classnames';
import {
  Button,
  Grid,
  MenuItem,
  TextField,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { ColorPicker, Modal, Select, Checkbox } from '@corva/ui/components';
import {
  getDefaultImperialUnit,
  getUnitPreference,
  getUnitsByType,
  showInfoNotification,
  showErrorNotification,
} from '@corva/ui/utils';
import { getAllUnitTypes } from '@corva/ui/utils/convert';

import { updateRealtimeValue } from '~/utils/realtimeBox';
import { getUnitTypeFromUnit } from '~/utils/getUnitTypeFromUnit';
import AppContext from '~/AppContext';

import { fetchWitsData } from '~/api/wits';
import { delDownHoleSensorHeaderData } from '~/api/sensor';
import { DRILLING_UNITS } from '~/streams';
import { convertToValue } from '~/utils/dataUtils';
import {
  DEFAULT_SENSOR_SERIES,
  DEFAULT_TRACE_COLORS,
  DRM_TRACES,
  LINE_STYLE_OPTIONS,
  PREDICTED_TRACES,
  SOURCE_TYPE,
  TRACE_SOURCES,
  TRACE_SOURCE_DEFINITIONS,
} from '~/constants';
import SingleBox from './SingleBox';
import styles from './styles.css';

const DEFAULT_TRACE_COLOR = '#C79100';
const DEFAULT_TRACE_VALUE = {
  trackType: TRACE_SOURCES.SENSOR_TRACE,
  sensorId: null,
  sensorName: null,
  traceName: null,
  displayName: null,
  unitType: null,
  unit: null,
  lineStyle: LINE_STYLE_OPTIONS[0].value,
  lineWidth: 2,
  color: DEFAULT_TRACE_COLOR,
  yAxisLabelVisible: true,
  sidePosition: 'left',
  isAutoScale: true,
  minValue: null,
  maxValue: null,
  traceMin: null,
  traceMax: null,
};
const MODAL_STATE = {
  closed: 'closed',
  createOpen: 'create dialog open',
  editOpen: 'edit dialog open',
};

const useStyles = makeStyles(({ palette }) => ({
  Select: {
    '& button': {
      display: 'none',
    },
  },
  MenuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '42px',
  },
  ConfirmModal: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  DeleteButton: {
    '&:hover': {
      backgroundColor: palette.background.default,
    },
  },
}));

function RealTimeBox({ isAddChannelDialogOpen, setIsAddChannelDialogOpen }) {
  const {
    provider,
    allChannels,
    columnMapping,
    mainData,
    channels,
    setChannels,
    onAppSettingChange,
    assetId,
    sensorHeaderData,
    sensorValueRange,
    saveSensorTimeAdjustment,
    setSensorDataChangeToggle,
  } = useContext(AppContext);
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(MODAL_STATE.closed);
  const [currentTrace, setCurrentTrace] = useState(DEFAULT_TRACE_VALUE);
  const [traceNameList, setTraceNameList] = useState([]);
  const editingTraceRef = useRef();
  const [saveClicked, setSaveClicked] = useState(false);
  const [hoveredSensorId, setHoveredSensorId] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const advancedChannels = useMemo(() => {
    const assetData = mainData?.find(data => data.assetId === assetId);
    return channels.map(channel => updateRealtimeValue(channel, assetData?.wits));
  }, [mainData, channels]);

  useEffect(() => {
    if (isAddChannelDialogOpen) {
      setCurrentTrace(DEFAULT_TRACE_VALUE);
      editingTraceRef.current = null;
      setOpenModal(MODAL_STATE.createOpen);
      setSaveClicked(false);
    }
  }, [isAddChannelDialogOpen]);

  useEffect(() => {
    if (currentTrace.trackType === TRACE_SOURCES.SENSOR_TRACE) {
      const realTraces = allChannels.map(channelName => ({
        value: channelName,
        label: startCase(channelName),
      }));

      if (openModal === MODAL_STATE.createOpen) {
        const filtered = realTraces.filter(
          item => channels.findIndex(channel => channel.traceName === item.value) === -1
        );
        setTraceNameList(filtered);
      } else {
        setTraceNameList(realTraces);
      }
    } else if (currentTrace.trackType === TRACE_SOURCES.MODEL_PREDICTION) {
      const filtered = PREDICTED_TRACES.map(item => ({ value: item.trace, label: item.label }));
      setTraceNameList(filtered);
    } else if (currentTrace.trackType === TRACE_SOURCES.DRM) {
      const filtered = DRM_TRACES.map(item => ({ value: item.trace, label: item.label }));
      setTraceNameList(filtered);
    } else if (openModal === MODAL_STATE.createOpen) {
      const addedSensorTraces = channels.filter(
        c => c.trackType === TRACE_SOURCES.DOWNHOLE && c.sensorName === currentTrace.sensorName
      );
      const filtered = DEFAULT_SENSOR_SERIES.filter(
        item => addedSensorTraces.findIndex(c => item.traceName === c.traceName) === -1
      );
      setTraceNameList(
        filtered.map(({ traceName }) => ({ value: traceName, label: startCase(traceName) }))
      );
    } else {
      setTraceNameList(
        DEFAULT_SENSOR_SERIES.map(({ traceName }) => ({
          value: traceName,
          label: startCase(traceName),
        }))
      );
    }
  }, [allChannels, channels, openModal, currentTrace.trackType, currentTrace.sensorName]);

  const trackOptions = useMemo(() => {
    if (sensorHeaderData) return TRACE_SOURCE_DEFINITIONS;
    return TRACE_SOURCE_DEFINITIONS.slice(0, 3);
  }, [sensorHeaderData]);

  const allUnitTypes = useMemo(() => {
    return getAllUnitTypes();
  }, []);

  const allUnitsByType = useMemo(() => {
    if (!currentTrace.unitType) return [];
    return getUnitsByType(currentTrace.unitType);
  }, [currentTrace.unitType]);

  const handleEditTrackOpen = selectedChannel => {
    const updatedTrace = omit(selectedChannel, ['value']);
    setCurrentTrace(updatedTrace);
    editingTraceRef.current = selectedChannel;
    setOpenModal(MODAL_STATE.editOpen);
    setSaveClicked(false);
  };

  const handleCloseTrackDialog = () => {
    setOpenModal(MODAL_STATE.closed);
    if (isAddChannelDialogOpen) {
      setIsAddChannelDialogOpen(false);
    }
  };

  const getMinMaxValue = async (traceName, sensorName) => {
    try {
      if (sensorName) {
        return [sensorValueRange?.[traceName]?.min, sensorValueRange?.[traceName]?.max];
      }

      const witsData = await fetchWitsData(SOURCE_TYPE.xhigh, assetId, [{ traceName }]);

      // Get min and max value by impperial unit
      const traceMin = minBy(witsData, item => item.data[traceName])?.data?.[traceName];
      const traceMax = maxBy(witsData, item => item.data[traceName])?.data?.[traceName];
      return [traceMin, traceMax];
    } catch (err) {
      return [null, null];
    }
  };

  const scaleInputError = useMemo(() => {
    if (Number.isFinite(currentTrace.minValue) && currentTrace.minValue >= currentTrace.maxValue) {
      return true;
    }
    return false;
  }, [currentTrace.minValue, currentTrace.maxValue]);

  const handleSaveTrack = async () => {
    setSaveClicked(true);
    const { sensorName, traceName, color } = currentTrace;

    const isValid = traceName && color && !scaleInputError;
    if (isValid) {
      let newChannels;
      if (openModal === MODAL_STATE.editOpen) {
        newChannels = channels.map(channel =>
          channel.traceName === editingTraceRef.current.traceName &&
          (!channel.sensorName || channel.sensorName === editingTraceRef.current.sensorName)
            ? currentTrace
            : channel
        );
      } else {
        const [traceMin, traceMax] = await getMinMaxValue(traceName, sensorName);
        newChannels = channels.concat({
          ...currentTrace,
          minValue: traceMin,
          maxValue: traceMax,
          traceMin,
          traceMax,
        });
      }

      onAppSettingChange('traces', newChannels);
      setChannels(newChannels);
      handleCloseTrackDialog();
    }
  };

  const deleteTrackAction = (traceName, sensorName, sensorId) => {
    const newChannels = channels.filter(
      channel => channel.traceName !== traceName || channel.sensorName !== sensorName
    );
    const channelsFromSameSensor = channels.filter(channel => channel.sensorId === sensorId);

    if (channelsFromSameSensor?.length === 1) {
      setTimeout(() => {
        saveSensorTimeAdjustment(null, sensorId);
      }, 1000);
    }
    onAppSettingChange('traces', newChannels);
    setChannels(newChannels);
  };

  const handleDeleteTrack = () => {
    deleteTrackAction(
      editingTraceRef.current.traceName,
      editingTraceRef.current.sensorName,
      editingTraceRef.current.sensorId
    );
    handleCloseTrackDialog();
  };

  const onTrackTypeChange = trackType => {
    setCurrentTrace(trace => ({
      ...trace,
      trackType,
      sensorId: trackType === TRACE_SOURCES.DOWNHOLE ? sensorHeaderData?.[0]?.id : null,
      sensorName: trackType === TRACE_SOURCES.DOWNHOLE ? sensorHeaderData?.[0]?.sensorName : null,
      traceName: null,
      unitType: null,
      unit: null,
    }));
  };

  const onSensorNameChange = newSensorName => {
    const sensorId = sensorHeaderData.find(i => i.sensorName === newSensorName)?.id;
    setCurrentTrace(trace => ({
      ...trace,
      sensorId,
      sensorName: newSensorName,
      traceName: null,
      unitType: null,
      unit: null,
    }));
  };

  const findTraceItem = traceName => {
    const foundItem = DEFAULT_TRACE_COLORS.find(item => snakeCase(item.label) === traceName);
    if (foundItem) {
      return { ...foundItem, unit: getUnitPreference(foundItem.unitType) };
    }

    switch (currentTrace.trackType) {
      case TRACE_SOURCES.SENSOR_TRACE:
        return DRILLING_UNITS.find(item => item.key === traceName);
      case TRACE_SOURCES.MODEL_PREDICTION:
        return PREDICTED_TRACES.find(item => item.trace === traceName);
      case TRACE_SOURCES.DRM:
        return DRM_TRACES.find(item => item.trace === traceName);
      default:
        return DEFAULT_SENSOR_SERIES.find(item => item.traceName === traceName);
    }
  };

  const getUnitsFromColumnMapping = traceName => {
    const unit = columnMapping[traceName]?.source_unit;
    const unitType = unit ? getUnitTypeFromUnit(unit) : null;

    return unitType ? { unit, unitType } : {};
  };

  const onTraceNameChange = traceName => {
    const foundItem = { ...findTraceItem(traceName), ...getUnitsFromColumnMapping(traceName) };

    const index = allUnitTypes.findIndex(item => item.type === foundItem?.unitType);
    if (index !== -1) {
      setCurrentTrace(trace => ({
        ...trace,
        traceName,
        unitType: foundItem.unitType,
        unit: foundItem.unit,
        color: foundItem.color ?? DEFAULT_TRACE_COLOR,
      }));
    } else {
      setCurrentTrace(trace => ({
        ...trace,
        traceName,
        unitType: null,
        unit: null,
      }));
    }
  };

  const onUnitChange = (key, value) => {
    let newMinValue;
    let newMaxValue;
    let newUnitType;
    let newUnit;
    const { minValue, maxValue, unitType, unit } = currentTrace;

    if (key === 'unitType') {
      newUnitType = value;
      newUnit = getDefaultImperialUnit(newUnitType);
      newMinValue = convertToValue(minValue, newUnitType, null, newUnit);
      newMaxValue = convertToValue(maxValue, newUnitType, null, newUnit);
    } else {
      newUnitType = unitType;
      newUnit = value;
      newMinValue = convertToValue(minValue, unitType, unit, value);
      newMaxValue = convertToValue(maxValue, unitType, unit, value);
    }

    setCurrentTrace(trace => ({
      ...trace,
      unitType: newUnitType,
      unit: newUnit,
      minValue: newMinValue,
      maxValue: newMaxValue,
    }));
  };

  const onValueChange = (key, value) => {
    setCurrentTrace(trace => ({
      ...trace,
      [key]: value,
    }));
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmModal(false);
  };

  const handleRemoveSensor = async () => {
    const result = await delDownHoleSensorHeaderData(provider, hoveredSensorId);

    if (result) {
      const channelsShouleRemove = channels.filter(channel => channel.sensorId === hoveredSensorId);

      deleteTrackAction(
        channelsShouleRemove[0].traceName,
        channelsShouleRemove[0].sensorName,
        channelsShouleRemove[0].sensorId
      );

      if (channelsShouleRemove.length === 2) {
        setTimeout(() => {
          const newChannels = channels.filter(channel => channel.sensorId !== hoveredSensorId);
          setTimeout(() => {
            saveSensorTimeAdjustment(null, hoveredSensorId);
          }, 1000);
          onAppSettingChange('traces', newChannels);
          setChannels(newChannels);
          setTimeout(() => {
            setSensorDataChangeToggle(true);
          }, 3000);
        }, 3000);
      } else {
        setTimeout(() => {
          setSensorDataChangeToggle(true);
        }, 4000);
      }

      showInfoNotification('Sensor data deleted successfully');
    } else showErrorNotification('Failed to delete sensor data');
    setOpenConfirmModal(false);
  };

  const truncateSensorName = sensorName => {
    if (sensorName?.length > 20) {
      const truncatedName = `${sensorName.slice(0, 6)}...${sensorName.slice(-6)}`;
      return truncatedName;
    }
    return sensorName;
  };

  return (
    <>
      <div className={styles.channelBox}>
        <div className={styles.channels}>
          <div className={styles.topGradient} />
          {advancedChannels.map(item => (
            <SingleBox
              key={`${item.traceName}-${item.sensorName}`}
              item={item}
              color={item.color}
              onClick={() => handleEditTrackOpen(item)}
            />
          ))}
          <div className={styles.bottomGradient} />
        </div>
      </div>

      <Modal
        open={openModal !== MODAL_STATE.closed}
        onClose={handleCloseTrackDialog}
        title={openModal === MODAL_STATE.createOpen ? 'Add Track' : 'Edit Track'}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        actionsClassName={styles.actionButtons}
        actions={
          <>
            {openModal === MODAL_STATE.editOpen && (
              <Button
                onClick={handleDeleteTrack}
                className={styles.deleteButton}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}
            <Button color="primary" onClick={handleCloseTrackDialog}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveTrack}>
              Save
            </Button>
          </>
        }
      >
        <div className={styles.modalContainer}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Select
                label="Track Type"
                value={currentTrace.trackType}
                error={saveClicked && !currentTrace.trackType}
                FormControlProps={{ classes: { root: styles.selectState } }}
                onChange={e => onTrackTypeChange(e.target.value)}
              >
                {trackOptions.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {currentTrace.trackType === TRACE_SOURCES.DOWNHOLE && sensorHeaderData && (
              <>
                <Grid item xs={6}>
                  <Select
                    label="Sensor Name"
                    className={classes.Select}
                    value={currentTrace.sensorName || ''}
                    FormControlProps={{ classes: { root: styles.selectState } }}
                    onChange={e => onSensorNameChange(e.target.value)}
                  >
                    {sensorHeaderData.map(item => (
                      <MenuItem
                        key={item.sensorName}
                        className={classes.MenuItem}
                        value={item.sensorName}
                        onMouseEnter={() => setHoveredSensorId(item.id)}
                      >
                        {truncateSensorName(item.sensorName)}
                        {hoveredSensorId && hoveredSensorId === item.id && (
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => setOpenConfirmModal(true)}
                            className={classes.DeleteButton}
                          >
                            <Tooltip id="button-report" title="Delete it from the collection">
                              <DeleteIcon variant="outlined" />
                            </Tooltip>
                          </IconButton>
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6} />
              </>
            )}

            <Grid item xs={6}>
              <Select
                label="Trace Name"
                value={currentTrace.traceName}
                error={saveClicked && !currentTrace.traceName}
                FormControlProps={{ classes: { root: styles.selectState } }}
                onChange={e => onTraceNameChange(e.target.value)}
              >
                {traceNameList.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Display Name"
                value={currentTrace.displayName}
                onChange={e => onValueChange('displayName', trim(e.target.value))}
                classes={{ root: styles.inputField }}
              />
            </Grid>

            {currentTrace.traceName && (
              <>
                <Grid item xs={6}>
                  <Select
                    label="Unit Type"
                    InputLabelProps={{ shrink: !!currentTrace.unitType }}
                    value={currentTrace.unitType}
                    FormControlProps={{ classes: { root: styles.selectState } }}
                    onChange={e => onUnitChange('unitType', e.target.value)}
                  >
                    {allUnitTypes.map(item => (
                      <MenuItem key={item.type} value={item.type}>
                        {item.display}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <Select
                    label="Unit"
                    InputLabelProps={{ shrink: !!currentTrace.unit }}
                    inputProps={{
                      name: 'unit',
                      id: 'unit',
                    }}
                    value={currentTrace.unit}
                    FormControlProps={{ classes: { root: styles.selectState } }}
                    onChange={e => onUnitChange('unit', e.target.value)}
                  >
                    {allUnitsByType.map(unit => (
                      <MenuItem key={unit.abbr} value={unit.abbr}>
                        {unit.display}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </>
            )}

            <Grid item xs={6}>
              <Select
                label="Line Style"
                value={currentTrace.lineStyle}
                renderValue={selected => (
                  <span
                    className={classnames(styles.lineStyle, {
                      [styles.lineStyleSolid]: selected === LINE_STYLE_OPTIONS[0].value,
                      [styles.lineStyleDotted]: selected === LINE_STYLE_OPTIONS[1].value,
                      [styles.lineStyleDashed]: selected === LINE_STYLE_OPTIONS[2].value,
                    })}
                  />
                )}
                FormControlProps={{ classes: { root: styles.selectState } }}
                onChange={e => onValueChange('lineStyle', e.target.value)}
              >
                {LINE_STYLE_OPTIONS.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    <span
                      className={classnames(styles.lineStyle, styles.lineStyleMenuItem, {
                        [styles.lineStyleSolid]: item.value === LINE_STYLE_OPTIONS[0].value,
                        [styles.lineStyleDotted]: item.value === LINE_STYLE_OPTIONS[1].value,
                        [styles.lineStyleDashed]: item.value === LINE_STYLE_OPTIONS[2].value,
                      })}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <div className={styles.colorWrapper}>
                <TextField
                  type="number"
                  label="Width"
                  InputLabelProps={{ shrink: !!currentTrace.lineWidth }}
                  value={currentTrace.lineWidth}
                  onChange={e =>
                    onValueChange('lineWidth', clamp(Number(e.target.value), 1, 10) || '')
                  }
                  classes={{ root: styles.inputField }}
                />
                <ColorPicker
                  label="Fill Color"
                  value={currentTrace.color}
                  onChange={value => onValueChange('color', value)}
                />
              </div>
            </Grid>

            <Grid item xs={6}>
              <Checkbox
                label="Visible"
                key="Visible"
                checked={currentTrace.yAxisLabelVisible}
                onChange={e => onValueChange('yAxisLabelVisible', e.target.checked)}
                spacing="normal"
                size="medium"
              />
              Show Y-Axis Label
            </Grid>

            <Grid item xs={6}>
              <Select
                label="Side"
                value={currentTrace.sidePosition}
                FormControlProps={{ classes: { root: styles.selectState } }}
                onChange={e => onValueChange('sidePosition', e.target.value)}
              >
                <MenuItem key="left" value="left">
                  Left
                </MenuItem>
                <MenuItem key="right" value="right">
                  Right
                </MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <Checkbox
                label="Auto Scale"
                key="Auto"
                checked={currentTrace.isAutoScale}
                onChange={e => onValueChange('isAutoScale', e.target.checked)}
                spacing="normal"
                size="medium"
              />
              Auto Scale
            </Grid>
            <Grid item xs={6} />

            <Grid item xs={6}>
              <TextField
                type="number"
                label="Min Value"
                value={Number.isFinite(currentTrace.minValue) ? currentTrace.minValue : ''}
                onChange={e => onValueChange('minValue', Number.parseFloat(e.target.value))}
                classes={{ root: styles.inputField }}
                disabled={currentTrace.isAutoScale}
                error={saveClicked && scaleInputError}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Max Value"
                value={Number.isFinite(currentTrace.maxValue) ? currentTrace.maxValue : ''}
                onChange={e => onValueChange('maxValue', Number.parseFloat(e.target.value))}
                classes={{ root: styles.inputField }}
                disabled={currentTrace.isAutoScale}
                error={saveClicked && scaleInputError}
              />
            </Grid>
          </Grid>
        </div>
      </Modal>
      <Modal
        open={openConfirmModal}
        onClose={handleCloseConfirmDialog}
        title={`Delete ${sensorHeaderData?.find(item => item.id === hoveredSensorId)?.sensorName}?`}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        actionsClassName={classes.ConfirmModal}
        actions={
          <>
            <Button color="primary" onClick={handleCloseConfirmDialog}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleRemoveSensor}>
              Delete
            </Button>
          </>
        }
      >
        <div className={styles.confirmModalContainer}>
          <Typography variant="subtitle2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Delete this data from the dataset. We will remove it from the chart AND delete it from
            the collection permanently
          </Typography>
        </div>
      </Modal>
    </>
  );
}

RealTimeBox.propTypes = {
  isAddChannelDialogOpen: PropTypes.bool.isRequired,
  setIsAddChannelDialogOpen: PropTypes.func.isRequired,
};

export default RealTimeBox;
