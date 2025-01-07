import { memo, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormControlLabel, makeStyles, withStyles } from '@material-ui/core';
import { AppSettingsPopover, Typography } from '@corva/ui/components';

import AppContext from '~/AppContext';
import DownholeSensorUploader from '../DownholeSensorUploader';
import IconPark from '../IconPark';

const StyledText16 = withStyles(theme => ({
  root: {
    color: theme.palette.primary.text7,
    marginBottom: 12,
  },
}))(Typography.Regular16);
const StyledCheckbox = withStyles({
  root: {
    marginRight: 3,
  },
})(Checkbox);

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '30px',
    marginBottom: '16px',
  },
  controls: {
    display: 'flex',
    gap: '16px',
  },
  selectFormControl: { marginBottom: 16, width: '164px' },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
  },
  uploadIcon: {
    margin: '0 4px',
  },
  settingsContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px 16px 16px',
  },
});

function Toolbar({ setIsAddChannelDialogOpen, settings, onAppSettingChange }) {
  const classes = useStyles();
  const { assetId, activePhase, provider, setSensorDataChangeToggle } = useContext(AppContext);
  const [isDownholeSensorOpen, setIsDownholeSensorOpen] = useState(false);

  const handleChangeSettings = (key, e) => {
    const newSettings = { ...settings, [key]: e.target.checked };
    onAppSettingChange('settings', newSettings);
  };

  return (
    <div className={classes.toolbar}>
      <span>{`Active Phase: ${activePhase ?? '-'}`}</span>
      <div className={classes.buttonGroup}>
        <Button
          color="primary"
          size="small"
          onClick={() => setIsAddChannelDialogOpen(true)}
          startIcon={<IconPark iconType="Plus" />}
        >
          Channel
        </Button>
        <Button
          color="primary"
          variant="contained"
          size="small"
          startIcon={<IconPark iconType="Upload" className={classes.uploadIcon} />}
          onClick={() => setIsDownholeSensorOpen(true)}
        >
          Upload
        </Button>
        <AppSettingsPopover>
          <div className={classes.settingsContent}>
            <StyledText16 paragraph>Display Options</StyledText16>
            <FormControlLabel
              size="medium"
              spacing="normal"
              direction="vertical"
              control={
                <StyledCheckbox
                  checked={settings.table}
                  size="medium"
                  onChange={e => handleChangeSettings('table', e)}
                />
              }
              label="Table"
            />
            <FormControlLabel
              size="medium"
              spacing="normal"
              direction="vertical"
              control={
                <StyledCheckbox
                  checked={settings.graph}
                  size="medium"
                  onChange={e => handleChangeSettings('graph', e)}
                />
              }
              label="Graph"
            />
          </div>
        </AppSettingsPopover>
      </div>

      <DownholeSensorUploader
        open={isDownholeSensorOpen}
        provider={provider}
        assetId={assetId}
        setSensorDataChangeToggle={setSensorDataChangeToggle}
        onClose={() => setIsDownholeSensorOpen(false)}
      />
    </div>
  );
}

Toolbar.propTypes = {
  setIsAddChannelDialogOpen: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    table: PropTypes.bool,
    graph: PropTypes.bool,
  }).isRequired,
  onAppSettingChange: PropTypes.func.isRequired,
};

export default memo(Toolbar);
