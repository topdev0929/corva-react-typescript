import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { flatMap, minBy } from 'lodash';
import { Button, MenuItem, TextField, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { ColorPicker, DateTimePicker, Modal, Select } from '@corva/ui/components';
import { DEFAULT_PHASE_COLOR } from '~/constants';

const DATE_FORMAT = 'MM/DD/YYYY, HH:mm:ss';

const validateTime = timestamp => moment.unix(timestamp).isValid();

const useStyles = makeStyles(({ palette }) => ({
  phaseModalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
  },
  phaseEditModal: {
    display: 'flex',
    flexDirection: 'column',
    width: '336px',
    gap: '16px',
  },
  phaseWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    '& > :first-child': {
      flex: 1,
    },
  },
  deleteButton: {
    margin: '0 auto 0 0',
    color: `${palette.error.main} !important`,
    '&:hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.2)',
    },
  },
}));

function PhaseManagerDialog({
  open,
  variant,
  phaseToShow,
  phasePickList,
  manualPhases,
  onSave,
  onClose,
  onDelete,
}) {
  const classes = useStyles();
  const [phaseName, setPhaseName] = useState(phaseToShow?.name || phasePickList?.[0]?.name);
  const [zone, setZone] = useState(phaseToShow?.zone ?? null);
  const [saveClicked, setSaveClicked] = useState(false);
  const [color, setColor] = useState(phaseToShow?.color ?? DEFAULT_PHASE_COLOR);
  const [startTime, setStartTime] = useState(phaseToShow?.start_time || null);
  const [endTime, setEndTime] = useState(phaseToShow?.end_time || null);

  useEffect(() => {
    setPhaseName(phaseToShow?.name || phasePickList?.[0]?.name);
    setZone(phaseToShow?.zone ?? null);
    setColor(phaseToShow?.color ?? DEFAULT_PHASE_COLOR);
    setStartTime(phaseToShow?.start_time || null);
    setEndTime(phaseToShow?.end_time || null);
    setSaveClicked(false);
  }, [phaseToShow]);

  const [prevEndTime, nextStartTime] = useMemo(() => {
    if (!phaseToShow) return [0, 0];
    const { start_time: startTime, end_time: endTime } = phaseToShow;
    const flattenPhases = flatMap(manualPhases);
    const prevPhase = minBy(
      flattenPhases.filter(item => item.end_time && item.end_time <= startTime),
      item => startTime - item.end_time
    );
    const nextPhase = minBy(
      flattenPhases.filter(item => endTime && item.start_time >= endTime),
      item => item.start_time - endTime
    );
    const res = [prevPhase?.end_time ?? null, nextPhase?.start_time ?? null];
    return res;
  }, [manualPhases, phaseToShow]);

  const zoneError = useMemo(() => !zone || zone < 1 || zone > 99, [zone]);

  const startTimeError = useMemo(() => {
    return !validateTime(startTime) || prevEndTime > startTime;
  }, [startTime, prevEndTime]);

  const [endTimeError, endTimeHelperText] = useMemo(() => {
    if (!phaseToShow?.end_time) return [false, ''];
    if (phaseToShow?.end_time && !validateTime(endTime)) {
      return [true, `Please select a date`];
    }
    if (nextStartTime && endTime > nextStartTime) {
      return [true, `Date should not be after ${moment.unix(nextStartTime).format(DATE_FORMAT)}`];
    }
    if (startTime && startTime > endTime) {
      return [true, `Date should be after Start Date`];
    }
    return [false, ''];
  }, [startTime, endTime, nextStartTime, phaseToShow]);

  const handleStartTimeChange = newDateTime => {
    setStartTime(moment(newDateTime, DATE_FORMAT).unix());
  };

  const handleEndTimeChange = newDateTime => {
    if (newDateTime !== moment(null).unix()) {
      setEndTime(moment(newDateTime, DATE_FORMAT).unix());
    }
  };

  const handleSave = () => {
    setSaveClicked(true);
    if (phaseName && !zoneError && (variant === 'add' || (!startTimeError && !endTimeError))) {
      onSave({
        id: phaseToShow?.id,
        name: phaseName,
        color,
        zone: Number(zone),
        start_time: startTime,
        end_time: endTime || null,
      });
    }
  };

  const handleDelete = () => {
    onDelete(phaseToShow);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={variant === 'add' ? 'Start New Phase' : 'Edit Phase'}
      actionsClassName={classes.phaseModalActions}
      actions={
        <>
          {variant === 'edit' && (
            <Button color="primary" onClick={handleDelete} className={classes.deleteButton}>
              <DeleteIcon />
              Delete
            </Button>
          )}
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {variant === 'add' ? 'Add' : 'Save'}
          </Button>
        </>
      }
    >
      <div className={classes.phaseEditModal}>
        <div className={classes.phaseWrapper}>
          <Select
            label="Phase Name"
            value={phaseName}
            onChange={e => setPhaseName(e.target.value)}
            error={saveClicked && !phaseName}
          >
            {phasePickList.map(phase => (
              <MenuItem key={phase.id} value={phase.name}>
                {phase.name}
              </MenuItem>
            ))}
          </Select>
          <ColorPicker label="Color" value={color} onChange={setColor} />
        </div>
        <TextField
          label="Zone"
          type="number"
          InputLabelProps={{ shrink: true }}
          value={zone}
          onChange={e => setZone(e.target.value)}
          error={saveClicked && zoneError}
          helperText={saveClicked && zoneError ? 'Please enter a value between 1 and 99.' : ''}
        />
        {variant === 'edit' && (
          <>
            <DateTimePicker
              label="Phase Start"
              value={moment.unix(startTime)}
              onChange={handleStartTimeChange}
              format={DATE_FORMAT}
              error={saveClicked && startTimeError}
              helperText={
                saveClicked && startTimeError
                  ? `Date should be after ${moment.unix(prevEndTime).format(DATE_FORMAT)}`
                  : ''
              }
            />
            <DateTimePicker
              label="Phase End"
              value={moment.unix(endTime)}
              onChange={handleEndTimeChange}
              format={DATE_FORMAT}
              error={saveClicked && endTimeError}
              helperText={saveClicked && endTimeError ? endTimeHelperText : ''}
            />
          </>
        )}
      </div>
    </Modal>
  );
}

PhaseManagerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(['add', 'edit']).isRequired,
  phaseToShow: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    zone: PropTypes.number,
    start_time: PropTypes.number,
    end_time: PropTypes.number,
  }),
  phasePickList: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  manualPhases: PropTypes.shape({}).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

PhaseManagerDialog.defaultProps = {
  phaseToShow: null,
};

export default PhaseManagerDialog;
