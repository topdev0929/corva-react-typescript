import { FunctionComponent, useEffect, useState } from 'react';
import { TextField, makeStyles, Popover } from '@material-ui/core';
import { Button, IconButton } from '@corva/ui/components';
import { showSuccessNotification } from '@corva/ui/utils';
import { Close as CloseIcon, Settings as SettingsIcon } from '@material-ui/icons';

import { DesignValues, Theme, Well } from '../../types';
import { useRecalculateTask } from '../../effects/useRecalculateTask';
import { useRecalculateSubscription } from '../../effects/useRecalculateSubscription';

const useStyles = makeStyles<Theme>({
  paper: {
    marginTop: 8,
    minWidth: '254px',
    width: '254px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 76,
    padding: '24px 16px 16px 16px',
  },
  container: {
    display: 'flex',
    padding: '8px 16px 16px',
    flexDirection: 'column',
    gap: 24,
  },
  actionContainer: {
    display: 'flex',
    gap: 16,
    justifyContent: 'end',
  },
});

type SettingsProps = {
  assetIds: number[];
  assetName: string;
  fracFleetId: number;
  designValues: DesignValues;
  basin: string;
  companyId: number;
  setRecalculate: (state: boolean) => void;
  setIsCalculating: (state: boolean) => void;
  setDesignValues: (state: DesignValues) => void;
};

const Settings: FunctionComponent<SettingsProps> = ({
  assetIds,
  assetName,
  fracFleetId,
  designValues,
  basin,
  companyId,
  setRecalculate,
  setIsCalculating,
  setDesignValues,
}) => {
  const classes = useStyles();

  const [maxRate, setMaxRate] = useState<number>(designValues.designRate);
  const [maxPressure, setMaxPressure] = useState<number>(designValues.designPressure);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { handleChangeSettings } = useRecalculateTask({
    assetIds,
    assetName,
    maxRate,
    maxPressure,
    fracFleetId,
    setIsCalculating,
    basin,
    companyId,
    setDesignValues,
    setAnchorEl,
  });

  const recalculateResult = useRecalculateSubscription(assetIds[0]);

  useEffect(() => {
    if (recalculateResult === 'success') {
      showSuccessNotification('Recalculation successfully completed');

      setRecalculate(true);
      setIsCalculating(false);
    }
  }, [recalculateResult]);

  const handleChange = key => e => {
    if (key === 'maxRate') {
      setMaxRate(+e.target.value);
    }
    if (key === 'maxPressure') {
      setMaxPressure(+e.target.value);
    }
  };

  const isOpen = Boolean(anchorEl);

  return (
    <div>
      <IconButton
        isActive={isOpen}
        onClick={handleClick}
        size="small"
        tooltipProps={{ title: 'Settings' }}
        variant="contained"
      >
        <SettingsIcon />
      </IconButton>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        marginThreshold={22}
        classes={{ paper: classes.paper }}
      >
        <div className={classes.header}>
          <div>Settings</div>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.container}>
          <TextField
            type="number"
            label="Design Rate"
            variant="standard"
            fullWidth
            defaultValue={maxRate}
            onChange={handleChange('maxRate')}
          />
          <TextField
            type="number"
            label="Design Pressure"
            variant="standard"
            fullWidth
            defaultValue={maxPressure}
            onChange={handleChange('maxPressure')}
          />
          <div className={classes.actionContainer}>
            <Button color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleChangeSettings}>
              Save
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default Settings;
