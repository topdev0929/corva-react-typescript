import { memo, useMemo, useContext } from 'react';
import { chain, flatMap, orderBy } from 'lodash';
import {
  makeStyles,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
} from '@material-ui/core';

import AppContext from '~/AppContext';
import {
  DATASET_OPTIONS,
  HIGH_DIFF_SECONDS,
  LOW_DIFF_SECONDS,
  MEDIUM_DIFF_SECONDS,
  REF_POINT_NONE,
  VIEW_MODE_OPTIONS,
  XHIGH_DIFF_SECONDS,
} from '~/constants';

const useStyles = makeStyles({
  selectFormControl: { marginBottom: 16, width: '100%' },
});

function Filters() {
  const {
    manualPhases,
    selectedPhases,
    setSelectedPhases,
    selectedZones,
    setSelectedZones,
    filteredPoints,
    timeRange,
    setTimeRange,
    preResetRange,
    setPreResetRange,
    appSettings,
    onAppSettingChange,
    onAppSettingsChange,
  } = useContext(AppContext);
  const classes = useStyles();

  const [phases, zones] = useMemo(() => {
    const phasesArray = orderBy(Object.keys(manualPhases));
    const flattedMap = flatMap(manualPhases, items => items);
    const zones = chain(flattedMap).map('zone').sort().uniq().value();
    return [phasesArray, zones];
  }, [manualPhases]);

  const renderValue = value => {
    if (value.length === 0) return 'All';
    if (value.length === 1) return value[0];
    return `${value.length} Selected`;
  };

  const handlePhasesChange = value => {
    setSelectedPhases(value);
    if (value.length !== 1 && appSettings.view_mode === VIEW_MODE_OPTIONS[1].value) {
      setTimeout(() => {
        onAppSettingsChange({ view_mode: VIEW_MODE_OPTIONS[0].value, ref_point: REF_POINT_NONE });
      }, 500);
    }
  };

  const handleViewModeChange = value => {
    onAppSettingChange('view_mode', value);
  };

  const handleRefPointChange = value => {
    onAppSettingChange('ref_point', value);
  };

  const getAdjustedTimeRange = diff => {
    let endTime = timeRange.end;
    let startTime = endTime - diff;
    if (startTime < timeRange.min) {
      startTime = timeRange.min;
      endTime = Math.min(startTime + diff, timeRange.max);
    }
    return { startTime, endTime };
  };

  const handleViewDatasetChange = viewDataset => {
    let newTimeRange;
    if (viewDataset === DATASET_OPTIONS[4].value) {
      newTimeRange = getAdjustedTimeRange(LOW_DIFF_SECONDS);
    } else if (viewDataset === DATASET_OPTIONS[3].value) {
      newTimeRange = getAdjustedTimeRange(MEDIUM_DIFF_SECONDS);
    } else if (viewDataset === DATASET_OPTIONS[2].value) {
      newTimeRange = getAdjustedTimeRange(HIGH_DIFF_SECONDS);
    } else if (viewDataset === DATASET_OPTIONS[1].value) {
      newTimeRange = getAdjustedTimeRange(XHIGH_DIFF_SECONDS);
    } else {
      newTimeRange = getAdjustedTimeRange(timeRange.max - timeRange.min);
    }

    const savingTimeRange = {
      ...timeRange,
      start_time: newTimeRange.start,
      end_time: newTimeRange.end,
    };

    setTimeRange(prev => ({
      ...prev,
      start: newTimeRange.startTime,
      end: newTimeRange.endTime,
    }));
    if (preResetRange) {
      setPreResetRange(null);
    }

    setTimeout(() => {
      onAppSettingsChange({ view_dataset: viewDataset, time_range: savingTimeRange });
    }, 500);
  };

  return (
    <div>
      <FormControl classes={{ root: classes.selectFormControl }}>
        <InputLabel shrink>Zone</InputLabel>
        <Select
          multiple
          displayEmpty
          value={selectedZones}
          onChange={e => setSelectedZones(e.target.value)}
          renderValue={renderValue}
        >
          {zones.map(zoneId => (
            <MenuItem key={zoneId} value={zoneId}>
              <Checkbox checked={selectedZones.includes(zoneId)} />
              <ListItemText primary={zoneId} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl classes={{ root: classes.selectFormControl }}>
        <InputLabel shrink>Filter to Phase</InputLabel>
        <Select
          multiple
          displayEmpty
          value={selectedPhases}
          onChange={e => handlePhasesChange(e.target.value)}
          renderValue={renderValue}
        >
          {phases.map(name => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selectedPhases.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl classes={{ root: classes.selectFormControl }}>
        <InputLabel shrink>View Mode</InputLabel>
        <Select value={appSettings.view_mode} onChange={e => handleViewModeChange(e.target.value)}>
          {VIEW_MODE_OPTIONS.map(mode => (
            <MenuItem
              key={mode.value}
              value={mode.value}
              disabled={mode.value === VIEW_MODE_OPTIONS[1].value && selectedPhases.length !== 1}
            >
              {mode.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {appSettings.view_mode === VIEW_MODE_OPTIONS[1].value && (
        <FormControl classes={{ root: classes.selectFormControl }}>
          <InputLabel shrink>Reference Point</InputLabel>
          <Select
            value={appSettings.ref_point}
            onChange={e => handleRefPointChange(e.target.value)}
          >
            {filteredPoints.map(point => (
              <MenuItem key={point.title} value={point.title}>
                {point.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <FormControl classes={{ root: classes.selectFormControl }}>
        <InputLabel shrink>Dataset</InputLabel>
        <Select
          value={appSettings.view_dataset}
          onChange={e => handleViewDatasetChange(e.target.value)}
        >
          {DATASET_OPTIONS.map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

Filters.propTypes = {};

Filters.defaultProps = {};

export default memo(Filters);
