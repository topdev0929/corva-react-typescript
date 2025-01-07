import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uuidV1 from 'uuid/v1';

import { withStyles, Button } from '@material-ui/core';

import Modal from '~/components/Modal';

import TrackSettings from './components/TrackSettings';
import SingleChannelTrackSettings from './components/SingleChannelTrackSettings';

import { DEFAULT_TRACK_SETTINGS, SETTINGS_KEY } from './constants';

import './AddEditTrack.css';

const PAGE_NAME = 'DC_AddEditTrack';

const AddEditTrack = ({
  children,
  classes,
  id,
  settings,
  onSettingsChange,
  settingsKey,
  mapping,
  multipleAssets,
}) => {
  const [isTrackSettingsOpen, setIsTrackSettingsOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(DEFAULT_TRACK_SETTINGS);

  const onSettingChange = (key, val) => {
    setCurrentSettings({ ...currentSettings, [key]: val });
  };

  const addTrack = () => {
    onSettingsChange({
      ...settings,
      [settingsKey]: [
        ...((settings && settings[settingsKey]) || []),
        {
          ...currentSettings,
          id: uuidV1(),
        },
      ],
    });
    setCurrentSettings(DEFAULT_TRACK_SETTINGS);
  };

  const removeTrack = () => {
    const updatedSettings = settings[settingsKey].filter(item => item.id !== id);
    onSettingsChange({
      ...settings,
      [settingsKey]: updatedSettings,
    });
    setIsTrackSettingsOpen(false);
  };

  const onTrackChange = () => {
    const updatedSettings = settings[settingsKey].map(item =>
      item.id === id ? currentSettings : item
    );
    onSettingsChange({
      ...settings,
      [settingsKey]: updatedSettings,
    });
    setIsTrackSettingsOpen(false);
  };

  useEffect(() => {
    const existingSettings = id
      ? settings[settingsKey].find(item => item.id === id)
      : DEFAULT_TRACK_SETTINGS;
    setCurrentSettings(existingSettings);
  }, [settings, settingsKey, id]);

  const onCancel = () => {
    const existingSettings = id
      ? settings[settingsKey].find(item => item.id === id)
      : DEFAULT_TRACK_SETTINGS;
    setCurrentSettings(existingSettings);
    setIsTrackSettingsOpen(false);
  };

  return (
    <>
      <div className={classes.link} onClick={id ? () => setIsTrackSettingsOpen(true) : addTrack}>
        {children}
      </div>
      <Modal
        open={isTrackSettingsOpen}
        title="Track Settings"
        actions={
          <div className="c-pc-track-setting-actions">
            {id && (
              <Button className={classes.button} color="primary" onClick={removeTrack}>
                Delete Track
              </Button>
            )}
            <Button
              data-testid={`${PAGE_NAME}_cancel`}
              className={classes.button}
              color="primary"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              data-testid={`${PAGE_NAME}_save`}
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={onTrackChange}
            >
              Save
            </Button>
          </div>
        }
      >
        {multipleAssets ? (
          <SingleChannelTrackSettings
            trackSettings={currentSettings}
            onChange={onSettingChange}
            mapping={mapping}
          />
        ) : (
          <TrackSettings
            settings={currentSettings}
            onChange={onSettingChange}
            mapping={mapping}
          />
        )}
      </Modal>
    </>
  );
};

AddEditTrack.propTypes = {
  settingsKey: PropTypes.string,
  multipleAssets: PropTypes.bool,
  settings: PropTypes.shape({}),
  onSettingsChange: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  id: PropTypes.string,
  mapping: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

AddEditTrack.defaultProps = {
  id: '',
  settingsKey: SETTINGS_KEY,
  settings: {},
  multipleAssets: false,
};

export default withStyles({
  link: { cursor: 'pointer' },
  button: { fontSize: 14, marginLeft: 20 },
})(AddEditTrack);
