import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Switch, FormControlLabel, makeStyles } from '@material-ui/core';

import { LayoutContext } from '../../../context/layoutContext';
import SettingsPopover from '../SettingsPopover';

const useStyles = makeStyles(() => ({
  settingsTitle: {
    fontSize: '20px',
    lineHeight: '24px',
    marginBottom: '16px',
  },
  settingsSubtitle: {
    color: '#BDBDBD',
    fontSize: '14px',
    lineHeight: '20px',
  },
  tooltip: {
    backgroundColor: 'rgba(59, 59, 59, 0.9)',
  },
}));

const DISABLED_IN_OVERLAY = 'Disabled on Overlay Mode';

function SideSetting(props) {
  const { isOverlayMode, setting, onSettingChange } = props;
  const { isResponsive } = useContext(LayoutContext);

  const {
    showFeedBar,
    showSlider,
    showLegendBar,
    showRealtimeValues,
    showStreamboxStatus,
    showTooltip,
  } = setting;
  const classes = useStyles();

  const handleSettingChange = (key, value) => {
    onSettingChange('sideSetting', { ...setting, [key]: value });
  };

  return (
    <SettingsPopover>
      <div className={classes.settingsTitle} data-testid="settingTitle">
        Settings
      </div>
      <div className={classes.settingsSubtitle}>Turn On / Off Functions:</div>
      {isResponsive && (
        <FormControlLabel
          control={
            <Switch
              checked={showRealtimeValues}
              onChange={e => handleSettingChange('showRealtimeValues', e.target.checked)}
              color="primary"
            />
          }
          label="Real-time Values"
        />
      )}
      <Tooltip
        classes={{ tooltip: classes.tooltip }}
        title={isOverlayMode ? DISABLED_IN_OVERLAY : ''}
        placement="left"
      >
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={showFeedBar && !isOverlayMode}
                onChange={e => handleSettingChange('showFeedBar', e.target.checked)}
                disabled={isOverlayMode}
                color="primary"
              />
            }
            label="Comments"
          />
        </div>
      </Tooltip>
      <FormControlLabel
        control={
          <Switch
            checked={showLegendBar}
            onChange={e => handleSettingChange('showLegendBar', e.target.checked)}
            color="primary"
          />
        }
        label="Legend"
      />
      <div>
        <FormControlLabel
          control={
            <Switch
              checked={showStreamboxStatus}
              onChange={e => handleSettingChange('showStreamboxStatus', e.target.checked)}
              color="primary"
            />
          }
          label="Streambox Status"
        />
      </div>
      {!isResponsive && (
        <Tooltip
          classes={{ tooltip: classes.tooltip }}
          title={isOverlayMode ? DISABLED_IN_OVERLAY : ''}
          placement="left"
        >
          <FormControlLabel
            control={
              <Switch
                checked={showSlider && !isOverlayMode}
                onChange={e => handleSettingChange('showSlider', e.target.checked)}
                disabled={isOverlayMode}
                color="primary"
              />
            }
            label="Slider"
          />
        </Tooltip>
      )}
      <div>
        <FormControlLabel
          control={
            <Switch
              checked={showTooltip}
              onChange={e => handleSettingChange('showTooltip', e.target.checked)}
              color="primary"
            />
          }
          label="Tooltip"
        />
      </div>
    </SettingsPopover>
  );
}

SideSetting.propTypes = {
  isOverlayMode: PropTypes.bool.isRequired,
  setting: PropTypes.shape({
    showFeedBar: PropTypes.bool,
    showSlider: PropTypes.bool,
    showStreamboxStatus: PropTypes.bool,
    showLegendBar: PropTypes.bool,
    showRealtimeValues: PropTypes.bool,
    showTooltip: PropTypes.bool,
  }).isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default SideSetting;
