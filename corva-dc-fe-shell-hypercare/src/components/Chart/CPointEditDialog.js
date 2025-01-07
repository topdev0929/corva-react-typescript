import { useEffect, useState } from 'react';
import { get, startCase } from 'lodash';
import PropTypes from 'prop-types';
import { Button, TextField, makeStyles, MenuItem } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton as ToggleButtonComponent } from '@material-ui/lab';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { ColorPicker, Modal, Select, DateTimePicker } from '@corva/ui/components';
import { showErrorNotification } from '@corva/ui/utils';
import { C_EVENT_LIST } from '~/constants';

const DATE_FORMAT = 'MM/DD/YYYY, hh:mm:ss';

const useStyles = makeStyles(({ palette }) => ({
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '392px',
    gap: '16px',
  },
  toggleButton: {
    width: '90px',
  },
  deleteButton: {
    margin: '0 auto 0 0',
    color: `${palette.error.main} !important`,
    '&:hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.2)',
    },
  },
  traceWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    '& > :first-child': {
      flex: 1,
    },
  },
}));

function CPointEditDialog({ open, currentUser, channels, point, onSave, onDelete, onClose }) {
  const classes = useStyles();
  const [interimPoint, setInterimPoint] = useState({});
  const [activeTab, setActiveTab] = useState('preset');
  const [saveClicked, setSaveClicked] = useState(false);

  useEffect(() => {
    if (open) {
      setInterimPoint({});
      setActiveTab('preset');
      setSaveClicked(false);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
    setSaveClicked(false);
  };

  useEffect(() => {
    if (point) {
      setInterimPoint(point);
      if (C_EVENT_LIST.findIndex(item => item.event === point.title) === -1) {
        setActiveTab('custom');
      } else {
        setActiveTab('preset');
      }
    }
  }, [point]);

  const handleSave = () => {
    setSaveClicked(true);
    if (interimPoint.title && interimPoint.trace) {
      onSave(point.id, {
        title: interimPoint.title,
        color: interimPoint.color,
        trace: interimPoint.trace,
        timestamp: interimPoint.timestamp,
        user: {
          id: get(currentUser, 'id'),
          name: `${get(currentUser, 'first_name')} ${get(currentUser, 'last_name')}`,
        },
      });
      handleClose();
    }
  };

  const handleDelete = () => {
    onDelete(point.id);
    handleClose();
  };

  const handleEventChange = value => {
    const foundEvent = C_EVENT_LIST.find(item => item.event === value);
    setInterimPoint(prev => ({ ...prev, title: value, trace: foundEvent?.trace || '' }));
  };

  const handleTraceChange = value => {
    const prevTrace = interimPoint.trace;
    if (
      ((prevTrace === 'pressure' || prevTrace === 'temperature') &&
        (value === 'pressure' || value === 'temperature')) ||
      (prevTrace !== 'pressure' &&
        prevTrace !== 'temperature' &&
        value !== 'pressure' &&
        value !== 'temperature')
    )
      setInterimPoint(prev => ({ ...prev, trace: value }));
    else {
      showErrorNotification(
        'Cannot move critical point from wits data to sensor data and vice versa.'
      );
    }
  };

  const handleDateTimeChange = newDateTime => {
    setInterimPoint(prev => ({ ...prev, timestamp: newDateTime.unix() }));
  };

  const handleColorChange = value => {
    setInterimPoint(prev => ({ ...prev, color: value }));
  };

  return (
    <Modal
      open={open && Boolean(point)}
      onClose={handleClose}
      title="Define Critical Point"
      actionsClassName={classes.dialogActions}
      actions={
        <>
          <Button color="primary" onClick={handleDelete} className={classes.deleteButton}>
            <DeleteIcon />
            Delete
          </Button>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <div className={classes.dialogContent}>
        <ToggleButtonGroup value={activeTab} size="small">
          <ToggleButtonComponent
            value="preset"
            onClick={() => setActiveTab('preset')}
            classes={{ root: classes.toggleButton }}
          >
            Preset
          </ToggleButtonComponent>
          <ToggleButtonComponent
            value="custom"
            onClick={() => setActiveTab('custom')}
            classes={{ root: classes.toggleButton }}
          >
            Custom
          </ToggleButtonComponent>
        </ToggleButtonGroup>

        {activeTab === 'preset' ? (
          <Select
            label="Event"
            value={interimPoint.title}
            error={saveClicked && !interimPoint.title}
            helperText={saveClicked && !interimPoint.title ? 'Please select an event.' : ''}
            onChange={e => handleEventChange(e.target.value)}
          >
            {C_EVENT_LIST.map(item => (
              <MenuItem key={item.event} value={item.event}>
                {item.event}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField
            label="Customize Event"
            InputLabelProps={{ shrink: true }}
            value={interimPoint.title}
            onChange={e => handleEventChange(e.target.value)}
            error={saveClicked && !interimPoint.title}
            helperText={saveClicked && !interimPoint.title ? 'Please enter a title.' : ''}
          />
        )}
        <div className={classes.dialogContent}>
          <DateTimePicker
            label="Critical Point Time"
            value={new Date(interimPoint.timestamp * 1000)}
            onChange={handleDateTimeChange}
            format={DATE_FORMAT}
            error={saveClicked}
          />
        </div>
        <div className={classes.traceWrapper}>
          <Select
            id="edit_critical_trace_mapping"
            label="Trace Mapping"
            InputLabelProps={{ shrink: !!interimPoint.trace }}
            value={interimPoint.trace}
            renderValue={value => {
              const matched = channels.find(_ => _.traceName === value);
              return matched?.displayName || matched.sensorName
                ? `${startCase(matched.traceName)} | ${matched.sensorName}`
                : startCase(matched.traceName);
            }}
            onChange={e => handleTraceChange(e.target.value)}
            error={saveClicked && !interimPoint.trace}
          >
            {channels.map(channel => (
              <MenuItem key={channel.traceName} value={channel.traceName}>
                {channel.displayName ||
                  (channel.sensorName
                    ? `${startCase(channel.traceName)} | ${channel.sensorName}`
                    : startCase(channel.traceName))}
              </MenuItem>
            ))}
          </Select>
          <ColorPicker label="Color" value={interimPoint.color} onChange={handleColorChange} />
        </div>
      </div>
    </Modal>
  );
}

CPointEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  channels: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  point: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    timestamp: PropTypes.number,
    user: { name: PropTypes.string },
    color: PropTypes.string,
  }),
  clientRect: PropTypes.shape({ left: PropTypes.number, top: PropTypes.number }),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

CPointEditDialog.defaultProps = {
  point: null,
  clientRect: null,
};

export default CPointEditDialog;
