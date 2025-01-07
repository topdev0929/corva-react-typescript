import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { get, startCase } from 'lodash';
import moment from 'moment';
import { Button, Menu, MenuItem, makeStyles } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
  ColorPicker,
  DateTimePicker,
  IconButton,
  Modal,
  Select,
  TextField,
} from '@corva/ui/components';
import { C_EVENT_LIST } from '~/constants';

const useStyles = makeStyles(({ palette }) => ({
  phaseModalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
  },
  phaseEditModal: {
    display: 'flex',
    flexDirection: 'column',
    width: '432px',
    gap: '16px',
  },
  addCircleButton: {
    padding: '8px !important',
    '& svg': {
      fill: `${palette.primary.main} !important`,
    },
  },
  timeDiv: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    '& > :first-child': {
      flex: 1,
    },
  },
}));

const DATE_FORMAT = 'MM/DD/YYYY, hh:mm:ss';

function CPointCreateDialog({ open, assetId, timestamp, currentUser, channels, onSave, onClose }) {
  const classes = useStyles();
  const inputRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [title, setTitle] = useState();
  const [dateTime, setDateTime] = useState(moment.unix(timestamp).toISOString());
  const [color, setColor] = useState('#f44336');
  const [traceName, setTraceName] = useState(null);
  const [saveClicked, setSaveClicked] = useState(false);

  useEffect(() => {
    setDateTime(moment.unix(timestamp).toISOString());
  }, [timestamp]);

  const handleDateTimeChange = newDateTime => {
    setDateTime(newDateTime);
  };

  const handleTitleChange = value => {
    setTitle(value);
    const foundEvent = C_EVENT_LIST.find(item => item.event === value);
    setTraceName(foundEvent?.trace || '');
  };

  const handleSave = () => {
    const channel = channels.find(item => {
      const name = item.sensorName
        ? `${startCase(item.traceName)} | ${item.sensorName}`
        : startCase(item.traceName);
      return name === traceName;
    });
    setSaveClicked(true);
    if (title && moment(dateTime).isValid() && traceName) {
      onSave({
        asset_id: assetId,
        data: {
          title,
          user: {
            id: get(currentUser, 'id'),
            name: `${get(currentUser, 'first_name')} ${get(currentUser, 'last_name')}`,
          },
          color,
          trace: traceName,
          timestamp: moment(dateTime).unix(),
          sensor_id: channel?.sensorId,
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Identify Critical Point"
      actionsClassName={classes.phaseModalActions}
      actions={
        <>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Add
          </Button>
        </>
      }
    >
      <div className={classes.phaseEditModal}>
        <TextField
          inputRef={inputRef}
          label="Custom Data Point Title"
          InputLabelProps={{ shrink: true }}
          value={title}
          onChange={e => setTitle(e.target.value)}
          error={saveClicked && !title}
          helperText={saveClicked && !title ? 'Please enter or select a title.' : ''}
          endIcon={
            <IconButton
              color="primary"
              classes={{ root: classes.addCircleButton }}
              tooltipProps={{ title: 'Choose From The List' }}
              onClick={() => setAnchorEl(inputRef.current)}
            >
              <AddCircleIcon />
            </IconButton>
          }
        />
        <div className={classes.timeDiv}>
          <DateTimePicker
            label="Critical Point Time"
            value={dateTime}
            onChange={handleDateTimeChange}
            format={DATE_FORMAT}
            error={saveClicked && !moment(dateTime).isValid()}
          />
          <ColorPicker label="Color" value={color} onChange={setColor} />
        </div>
        <div className={classes.timeDiv}>
          <Select
            id="add_critical_trace_mapping"
            label="Trace Mapping"
            InputLabelProps={{ shrink: !!traceName }}
            value={traceName}
            renderValue={value => {
              const matched = channels.find(channel => {
                const name = channel.sensorName
                  ? `${startCase(channel.traceName)} | ${channel.sensorName}`
                  : startCase(channel.traceName);
                return name === value;
              });
              return matched?.displayName || startCase(value);
            }}
            onChange={e => setTraceName(e.target.value)}
            error={saveClicked && !traceName}
          >
            {channels.map(channel => {
              const { displayName, traceName, sensorName } = channel;
              const name = sensorName ? `${startCase(traceName)} | ${sensorName}` : traceName;
              const renderName = sensorName
                ? `${startCase(traceName)} | ${sensorName}`
                : startCase(traceName);
              return (
                <MenuItem key={name} value={name}>
                  {displayName || renderName}
                </MenuItem>
              );
            })}
          </Select>
        </div>

        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {C_EVENT_LIST.map(item => (
            <MenuItem
              key={item.event}
              selected={item.event === title}
              onClick={() => {
                handleTitleChange(item.event);
                setAnchorEl(null);
              }}
            >
              {item.event}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </Modal>
  );
}

CPointCreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  assetId: PropTypes.number.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  timestamp: PropTypes.number.isRequired,
  channels: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CPointCreateDialog;
