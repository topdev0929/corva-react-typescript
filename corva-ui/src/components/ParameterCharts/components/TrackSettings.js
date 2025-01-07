import { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { FormControl, TextField, withStyles, Grid, IconButton, Button } from '@material-ui/core';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';

import ColorPicker from '~/components/ColorPicker';
import Modal from '~/components/Modal';

import TraceSettings from './TraceSettings';
import TraceSelect from './TraceSelect';

import { DEFAULT_TRACE_SETTINGS, MAX_TRACE_COUNT } from '../constants';

import styles from './TrackSettings.css';

const TrackSettings = ({ settings: { name, traces }, onChange, classes, mapping }) => {
  const [isTraceSettingsVisible, setIsTraceSettingsVisible] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState();

  const onTraceTypeChange = (id, value) => {
    const updatedTraces = traces.map(trace => {
      const currentMapping = mapping.find(({ key }) => value === key);
      if (trace.id === id) {
        return {
          ...trace,
          ...currentMapping,
        };
      } else {
        return trace;
      }
    });
    onChange('traces', updatedTraces);
  };

  const onTraceChange = (id, key, value) => {
    const updatedTraces = traces.map(trace => {
      if (trace.id === id) {
        return {
          ...trace,
          [key]: value,
        };
      } else {
        return trace;
      }
    });
    onChange('traces', updatedTraces);
  };

  const addTrace = () => {
    if (!traces || !traces.length) {
      onChange('traces', [{ id: uuid(), ...DEFAULT_TRACE_SETTINGS }]);
    } else {
      onChange('traces', [...traces, { id: uuid(), ...DEFAULT_TRACE_SETTINGS }]);
    }
  };

  const isMaxNumOftraces = traces && traces.length > MAX_TRACE_COUNT;

  const showTraceSettings = index => {
    setSelectedTrace(traces[index]);
    setIsTraceSettingsVisible(true);
  };

  const onTraceSettingsChange = (key, value) => {
    setSelectedTrace({
      ...selectedTrace,
      [key]: value,
    });
  };

  const deleteTrace = () => {
    const updatedTraces = traces.filter(({ id }) => id !== selectedTrace.id);
    onChange('traces', updatedTraces);
    setIsTraceSettingsVisible(false);
  };

  const saveTrace = () => {
    const updatedTraces = traces.map(trace =>
      trace.id === selectedTrace.id ? selectedTrace : trace
    );
    onChange('traces', updatedTraces);
    setIsTraceSettingsVisible(false);
  };

  return (
    <Grid className={classes.container}>
      <FormControl className={classes.input}>
        <TextField
          label="Track Name"
          value={name}
          className={classes.input}
          onChange={({ target: { value } }) => onChange('name', value)}
        />
      </FormControl>
      <div className={styles.title}>Traces: </div>
      {traces && !!traces.length && (
        <div className={styles.tracesContainer}>
          {traces.map(({ id, key, color }, index) => (
            <div className={styles.tracesItem} key={id}>
              <TraceSelect
                value={key}
                onChange={val => onTraceTypeChange(id, val)}
                mapping={mapping}
              />
              <div className={styles.colorPicker}>
                <ColorPicker
                  value={color}
                  onChange={val => onTraceChange(id, 'color', val)}
                  hideLabel
                  buttonClassName={classes.picker}
                />
              </div>
              <IconButton
                onClick={() => showTraceSettings(index)}
                className={classes.navBtn}
              >
                <NavigateNextIcon fontSize="small" className={classes.navIcon} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
      {!isMaxNumOftraces && (
        <Button color="primary" onClick={addTrace}>
          <AddIcon />
          <span>Add Trace</span>
        </Button>
      )}
      <Modal
        open={isTraceSettingsVisible}
        title={
          <div className={styles.modalTitle}>
            <span className={styles.trackTitle} onClick={saveTrace}>
              Track Settings /{' '}
            </span>
            {selectedTrace && selectedTrace.name || 'Empty Trace'}
          </div>
        }
        actions={
          <div className={styles.actions}>
            <Button className={classes.button} color="primary" onClick={deleteTrace}>
              Delete Trace
            </Button>
            <Button
              className={classes.button}
              color="primary"
              onClick={() => setIsTraceSettingsVisible(false)}
            >
              Cancel
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={saveTrace}
            >
              Save
            </Button>
          </div>
        }
      >
        <TraceSettings
          traceSettings={selectedTrace}
          onChange={onTraceSettingsChange}
          mapping={mapping}
        />
      </Modal>
    </Grid>
  );
};

TrackSettings.propTypes = {
  settings: PropTypes.shape({
    name: PropTypes.string.isRequired,
    traces: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  mapping: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default withStyles(_theme => ({
  container: {
    paddingTop: 20,
    minWidth: 300,
  },
  input: {
    width: 200,
  },
  picker: {
    width: 36,
    minWidth: 36,
    height: 24,
  },
  navBtn: {
    position: 'absolute',
    right: -10,
    top: '50%',
    transform: 'translate(0, -50%)',
  },
  navIcon: {
    color: '#BDBDBD',
  },
  button: { fontSize: 14, marginLeft: 20 },
}))(TrackSettings);
