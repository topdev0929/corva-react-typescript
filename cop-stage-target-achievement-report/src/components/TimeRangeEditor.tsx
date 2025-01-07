import { FunctionComponent } from 'react';
import { Select, MenuItem, makeStyles, FormControl, InputLabel } from '@material-ui/core';
import { DateTimePicker } from '@corva/ui/components';
import moment from 'moment';

import { TIME_RANGE_OPTIONS, TIME_RANGE_OPTIONS_KEYS } from '../constants';
import { TimeRangeSetting } from '../types';

const useStyles = makeStyles({
  editorContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 16,
    marginBottom: 16,
  },
  modeSelect: {
    width: 140,
  },
  timeRangePicker: {
    width: 120,
  },
});

type TimeRangeEditorProps = {
  setting: TimeRangeSetting;
  onSettingChange: (value: TimeRangeSetting) => void;
};

const TimeRangeEditor: FunctionComponent<TimeRangeEditorProps> = ({ setting, onSettingChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.editorContainer}>
      <FormControl>
        <InputLabel htmlFor="timeMode">Time range</InputLabel>
        <Select
          className={classes.modeSelect}
          inputProps={{ id: 'timeMode' }}
          value={setting.mode}
          label="Time range"
          onChange={e => {
            if (e.target.value) onSettingChange({ ...setting, mode: e.target.value as string });
          }}
        >
          {TIME_RANGE_OPTIONS.map(({ key, label }) => (
            <MenuItem value={key} key={key}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {setting.mode === TIME_RANGE_OPTIONS_KEYS.customTimeRange && (
        <>
          <DateTimePicker
            variant="inline"
            label="Start"
            value={setting.customTimeStart ? moment.unix(setting.customTimeStart) : null}
            onChange={customTimeStart => onSettingChange({ ...setting, customTimeStart })}
            error={!!setting.customTimeStart}
            invalidDateMessage=""
            minDateMessage=""
            maxDateMessage=""
            className={classes.timeRangePicker}
          />
          <DateTimePicker
            variant="inline"
            label="End"
            value={setting.customTimeEnd ? moment.unix(setting.customTimeEnd) : null}
            onChange={customTimeEnd => onSettingChange({ ...setting, customTimeEnd })}
            error={!!setting.customTimeEnd}
            invalidDateMessage=""
            minDateMessage=""
            maxDateMessage=""
            className={classes.timeRangePicker}
          />
        </>
      )}
    </div>
  );
};

export default TimeRangeEditor;
