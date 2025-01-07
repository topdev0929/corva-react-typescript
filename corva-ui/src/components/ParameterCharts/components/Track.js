import { useMemo, useContext, useRef } from 'react';
import uuid from 'uuid';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { range } from 'lodash';

import { DEFAULT_TRACK_SETTINGS } from '../constants';

import AddEditTrack from '../AddEditTrack';
import TraceHeader from './TraceHeader';
import ChartContainer from './ChartContainer';

import SettingsContext from '../SettingsContext';
import DataContext from '../DataContext';

import styles from './Track.css';

const Track = ({ id, index }) => {
  const {
    horizontal,
    settingsKey,
    settings,
    onSettingsChange,
    maxTracesCount,
    multipleAssets,
  } = useContext(SettingsContext);
  const { mapping } = useContext(DataContext);

  const trackSettingsRef = useRef();

  const trackSettings = useMemo(
    () => (id ? settings[settingsKey].find(item => item.id === id) : DEFAULT_TRACK_SETTINGS),
    [id, settings, settingsKey]
  );

  const deleteTrace = traceId => {
    const updatedSettings = settings[settingsKey].map(item => {
      if (id === item.id) {
        return {
          ...item,
          traces: item.traces && item.traces.filter(trace => trace.id !== traceId),
        };
      } else {
        return item;
      }
    });
    onSettingsChange({
      ...settings,
      [settingsKey]: updatedSettings,
    });
  };

  const onTraceChange = newSettings => {
    let updateTraces = [];

    if (newSettings.id) {
      updateTraces = trackSettings.traces.map(item =>
        item.id === newSettings.id ? newSettings : item
      );
    } else {
      updateTraces = [...trackSettings.traces, { ...newSettings, id: uuid() }];
    }

    const updatedSettings = settings[settingsKey].map(item => {
      if (id === item.id) {
        return {
          ...item,
          traces: updateTraces,
        };
      } else {
        return item;
      }
    });
    onSettingsChange({
      ...settings,
      [settingsKey]: updatedSettings,
    });
  };

  const openTrackSettings = () => {
    trackSettingsRef.current.click();
  };

  const trackName = useMemo(() => {
    if (!multipleAssets) return trackSettings.name;
    const mappingValue = mapping.find(item => item.key === trackSettings.traces?.[0]?.key);
    return mappingValue ? mappingValue.name : trackSettings.name;
  }, [trackSettings.traces, trackSettings.name, multipleAssets]);

  return (
    <>
      <div
        className={classNames(styles.container, {
          [styles.horizontal]: horizontal,
          [styles.vertical]: !horizontal,
        })}
      >
        <AddEditTrack
          mapping={mapping}
          settings={settings}
          onSettingsChange={onSettingsChange}
          settingsKey={settingsKey}
          id={id}
          multipleAssets={multipleAssets}
        >
          <div className={styles.header} ref={trackSettingsRef}>
            <div className={styles.title}>{trackName}</div>
          </div>
        </AddEditTrack>
        {!multipleAssets &&
          range(maxTracesCount).map(indx => (
            <TraceHeader
              key={trackSettings.traces[indx] ? trackSettings.traces[indx].id : indx}
              index={indx}
              traceSettings={trackSettings.traces[indx]}
              onDelete={deleteTrace}
              mapping={mapping}
              onChange={onTraceChange}
              openTrackSettings={openTrackSettings}
            />
          ))}
        <ChartContainer traces={trackSettings.traces} trackIndex={index} />
      </div>
    </>
  );
};

Track.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number.isRequired,
};

Track.defaultProps = {
  id: '',
};

export default Track;
