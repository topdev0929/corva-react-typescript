import { useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get, isEqual, last } from 'lodash';
import AddIcon from '@material-ui/icons/Add';

import { withStyles, Button, Tooltip } from '@material-ui/core';

import Modal from '~/components/Modal';
import { getUnitDisplay } from '~/utils/convert';

import TraceSettings from './TraceSettings';

import SettingsContext from '../SettingsContext';
import DataContext from '../DataContext';

import { DEFAULT_TRACE_SETTINGS, MAX_TRACE_COUNT } from '../constants';

import styles from './TraceHeader.css';

const round = val => {
  return Number.isFinite(val) ? Math.round(val * 100) / 100 : '-';
}

const TraceHeader = ({
  onChange,
  onDelete,
  traceSettings,
  classes,
  mapping,
  index,
  openTrackSettings,
}) => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isAddingTraceInProgress, setIsAddingTraceInProgress] = useState(false);
  const [isAddTraceVisible, setIsAddTraceVisible] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(traceSettings);
  const [newTraceSettings, setNewTraceSettings] = useState(DEFAULT_TRACE_SETTINGS);
  const { horizontal, maxTracesCount } = useContext(SettingsContext);
  const { parsedData } = useContext(DataContext);
  const timer = useRef();

  const { min, max, data } = get(
    parsedData,
    traceSettings && `${traceSettings.collection}.${traceSettings.key}`,
    {}
  );
  const showMinimalInfo = maxTracesCount >= 5;

  const onSettingsChange = (key, value) => {
    const [settings, setSettings] = isAddingTraceInProgress
      ? [newTraceSettings, setNewTraceSettings]
      : [currentSettings, setCurrentSettings];
    if (key === 'key') {
      // Trace change
      const mappingData = mapping.find(item => item.key === value);
      setSettings({
        ...settings,
        [key]: value,
        ...mappingData,
      });
    } else {
      setSettings({
        ...settings,
        [key]: value,
      });
    }
  };

  const onSave = () => {
    onChange(isAddingTraceInProgress ? newTraceSettings : currentSettings);
    setIsSettingsVisible(false);
    setIsAddingTraceInProgress(false);
    setNewTraceSettings(DEFAULT_TRACE_SETTINGS);
  };

  const autoHideAddingTrraces = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIsAddTraceVisible(false);
    }, 1000);
  };

  const deleteTrace = () => {
    onDelete(traceSettings.id);
    setIsSettingsVisible(false);
  };

  const addNewTrace = () => {
    setIsAddingTraceInProgress(true);
    setIsSettingsVisible(true);
  };

  const onSettingsClose = () => {
    setIsSettingsVisible(false);
    setIsAddingTraceInProgress(false);
    setNewTraceSettings(DEFAULT_TRACE_SETTINGS);
  };

  const isEpmty = !traceSettings || !traceSettings.name;

  const isLastTrace = index === maxTracesCount - 1;

  const isTracesLimitReached = maxTracesCount >= MAX_TRACE_COUNT;

  const isSaveDisabled = isAddingTraceInProgress
    ? !newTraceSettings.key
    : isEqual(traceSettings, currentSettings);

  const onTrackClick = () => {
    onSave();
    openTrackSettings();
  };

  const actualValue = data ? round(get(last(data), 1, '-')) : '-';
  
  return (
    <div
      onMouseEnter={() => setIsAddTraceVisible(true)}
      onMouseLeave={autoHideAddingTrraces}
      className={classNames(styles.container, {
        [styles.horizontal]: horizontal,
      })}
    >
      <Tooltip
        title={
          showMinimalInfo && !isEpmty ? (
            <p>
              {traceSettings.name}: <br /> {actualValue} (
              {getUnitDisplay(traceSettings.unitType) || traceSettings.unit})
            </p>
          ) : (
            ''
          )
        }
      >
        <div
          className={classNames(styles.header, {
            [styles.horizontal]: horizontal,
            [styles.vertical]: !horizontal,
            [styles.last]: isLastTrace,
            [styles.minimal]: showMinimalInfo,
          })}
          onClick={() => setIsSettingsVisible(true)}
        >
          {isEpmty && (
            <div className={styles.empty}>
              <AddIcon color="primary" fontSize="small" />
            </div>
          )}
          {!isEpmty && (
            <>
              {!showMinimalInfo && (
                <span className={styles.unit}>
                  {traceSettings.name} ({getUnitDisplay(traceSettings.unitType) || traceSettings.unit})
                </span>
              )}
              <span className={styles.current}>{actualValue}</span>
              <div className={styles.values}>
                <span className={styles.min}>
                  {!traceSettings.autoScale && Number.isFinite(traceSettings.scaleMin)
                    ? traceSettings.scaleMin
                    : round(min)}
                </span>
                <span className={styles.max}>
                  {!traceSettings.autoScale && Number.isFinite(traceSettings.scaleMax)
                    ? traceSettings.scaleMax
                    : round(max)}
                </span>
              </div>
              <div
                className={styles.line}
                style={{
                  borderColor: traceSettings.color,
                  borderStyle: traceSettings.dashStyle,
                }}
              />
            </>
          )}
        </div>
      </Tooltip>
      {isLastTrace && !isEpmty && isAddTraceVisible && !isTracesLimitReached && (
        <div
          className={styles.addTrace}
          onClick={addNewTrace}
          onMouseLeave={autoHideAddingTrraces}
          onMouseEnter={() => clearTimeout(timer.current)}
        >
          <AddIcon color="primary" fontSize="small" />
        </div>
      )}
      <Modal
        open={isSettingsVisible}
        title={
          <div className={styles.modalTitle}>
            <span className={styles.trackTitle} onClick={onTrackClick}>
              Track Settings /{' '}
            </span>
            {traceSettings.name || 'Empty Trace'}
          </div>
        }
        actions={
          <div className={styles.actions}>
            <Button
              className={classes.button}
              color="primary"
              onClick={deleteTrace}
              disabled={!traceSettings || !traceSettings.id}
            >
              Delete Trace
            </Button>
            <Button className={classes.button} color="primary" onClick={onSettingsClose}>
              Cancel
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={onSave}
              disabled={isSaveDisabled}
            >
              Save
            </Button>
          </div>
        }
      >
        <TraceSettings
          traceSettings={isAddingTraceInProgress ? newTraceSettings : currentSettings}
          onChange={onSettingsChange}
          mapping={mapping}
        />
      </Modal>
    </div>
  );
};

TraceHeader.propTypes = {
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  openTrackSettings: PropTypes.func,
  classes: PropTypes.shape({}).isRequired,
  traceSettings: PropTypes.shape({
    name: PropTypes.string,
    key: PropTypes.string,
    id: PropTypes.string,
    unit: PropTypes.string,
    unitType: PropTypes.string,
    autoScale: PropTypes.bool,
    scaleMin: PropTypes.string,
    scaleMax: PropTypes.string,
    color: PropTypes.string,
    dashStyle: PropTypes.string,
    collection: PropTypes.string,
  }),
  mapping: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  index: PropTypes.number.isRequired,
};

TraceHeader.defaultProps = {
  traceSettings: DEFAULT_TRACE_SETTINGS,
  openTrackSettings: () => {},
};

export default withStyles({
  button: { fontSize: 14, marginLeft: 20 },
})(TraceHeader);
