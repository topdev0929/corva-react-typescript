import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toNumber } from 'lodash';

import {
  withStyles,
  FormControl,
  InputLabel,
  FormControlLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
} from '@material-ui/core';

import ColorPicker from '~/components/ColorPicker';

import TraceSelect from './TraceSelect';

import styles from './TraceSettings.css';

const StyledMenuItem = withStyles({
  root: {
    minHeight: 35,
  },
})(MenuItem);

const TraceSettings = ({ traceSettings, onChange, mapping, classes }) => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <TraceSelect
          value={traceSettings.key}
          onChange={val => onChange('key', val)}
          mapping={mapping}
          showLabel
        />
      </div>
      {traceSettings.key && (
        <>
          <div className={styles.item}>
            <FormControl>
              <InputLabel htmlFor="traceType">Trace Type</InputLabel>
              <Select
                displayEmpty
                value={traceSettings.traceType}
                className={classes.select}
                onChange={e => onChange('traceType', e.target.value)}
                inputProps={{
                  name: 'traceType',
                }}
              >
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="numeric" disabled>
                  Numeric
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Width"
              type="number"
              name="lineWidth"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{ inputProps: { min: 1, max: 5 } }}
              className={classes.lineWidth}
              value={traceSettings.lineWidth}
              onChange={e => onChange('lineWidth', toNumber(e.target.value))}
            />
            <ColorPicker
              buttonClassName={classes.colorPickerBtn}
              className={classes.colorPicker}
              value={traceSettings.color}
              onChange={val => onChange('color', val)}
              label="Fill color"
            />
          </div>
          <div className={styles.item}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="dashStyle">Line Style</InputLabel>
              <Select
                value={traceSettings.dashStyle}
                onChange={e => onChange('dashStyle', e.target.value)}
                inputProps={{
                  name: 'dashStyle',
                }}
                classes={{
                  select: classes.lineSelect,
                }}
              >
                <StyledMenuItem key="Line" value="Solid">
                  <span className={classNames(styles.line)} />
                </StyledMenuItem>
                <StyledMenuItem key="Dotted" value="Dot">
                  <span className={classNames(styles.line, styles.dotted)} />
                </StyledMenuItem>
                <StyledMenuItem key="Dashed" value="Dash">
                  <span className={classNames(styles.line, styles.dashed)} />
                </StyledMenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={styles.item}>
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={traceSettings.autoScale}
                    color="primary"
                    onChange={e => onChange('autoScale', e.target.checked)}
                    value="autoScale"
                  />
                }
                label="Auto Scale"
              />
            </FormControl>
          </div>

          {!traceSettings.autoScale && (
            <div className={styles.scales}>
              <TextField
                label="Min Value"
                type="number"
                value={traceSettings.scaleMin}
                onChange={e => onChange('scaleMin', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue=""
              />
              <TextField
                label="Max Value"
                type="number"
                value={traceSettings.scaleMax}
                onChange={e => onChange('scaleMax', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue=""
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

TraceSettings.propTypes = {
  traceSettings: PropTypes.shape({
    lineWidth: PropTypes.number,
    scaleMin: PropTypes.number,
    scaleMax: PropTypes.number,
    key: PropTypes.string,
    color: PropTypes.string,
    autoScale: PropTypes.bool,
    dashStyle: PropTypes.string,
    traceType: PropTypes.string.isRequired,
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

export default withStyles({
  select: {
    minWidth: 200,
  },
  lineSelect: {
    minWidth: 175,
    display: 'flex',
    alignItems: 'center',
  },
  lineWidth: {
    width: 64,
    margin: '0 30px',
  },
  colorPicker: {
    whiteSpace: 'nowrap',
  },
  colorPickerBtn: {
    width: 36,
    minWidth: 36,
    height: 24,
  },
})(TraceSettings);
