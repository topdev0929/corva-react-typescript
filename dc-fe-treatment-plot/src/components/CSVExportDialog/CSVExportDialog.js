import { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  makeStyles,
  withStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import { Button, Modal, DateTimePicker } from '@corva/ui/components';

import { TIME_RANGES, TIME_RANGE_TYPES, VIEWER_TIME_RANGE_TYPES } from '@/constants';
import { METADATA } from '@/meta';
import { loadAssetStageTimesData } from '@/utils/apiCalls';
import { parseDropdownRangeArray } from '@/utils/dropdownRange';
import { useCsvExport, useExportRangeValidation } from '@/effects/csvExport';
import { useAppContext } from '@/context/AppContext';

import DropdownRange from '../FilterBox/DropdownRange';

const StyledButton = withStyles({ root: { height: '36px' } })(Button);
const CancelButton = withStyles({ root: { margin: '0 16px 0 auto' } })(StyledButton);

const useStyles = makeStyles(theme => ({
  modalContainer: {
    width: 552,
  },
  stagesContainer: {
    marginTop: 16,

    '& .selectFormControl': {
      marginBottom: 0,
    },
  },
  datetimePickerContainer: {
    marginTop: 16,
    display: 'flex',
    height: 58,

    '& > :first-child': {
      marginRight: 16,
    },
  },
  timeRangePicker: {
    width: 228,
  },
  exportTimeRangeRequest: {
    marginTop: 16,
  },
  exportTimeRangeRequestLabel: {
    color: theme.palette.primary.text6,
  },
}));

const DATETIME_FORMAT = 'MM/DD/YYYY HH:mm';
function CSVExportDialog(props) {
  const { isDialogOpen, onCancel, currentAsset, latestWitsData, isLive, companyId } = props;
  const { isAssetViewer } = useAppContext();
  const classes = useStyles();
  const [timeRangeType, setTimeRangeType] = useState(TIME_RANGE_TYPES[0].key);
  const [timeRange, setTimeRange] = useState({
    from: null,
    to: null,
  });
  const [selectedStages, setSelectedStages] = useState([]);
  const [stageTimes, setStageTimes] = useState([]);

  const assetId = currentAsset?.asset_id;
  useEffect(() => {
    async function fetchStageTimesData(assetId) {
      const allData = await loadAssetStageTimesData(assetId);
      setStageTimes(allData);
    }

    if (assetId && isDialogOpen) {
      fetchStageTimesData(assetId);
    }
  }, [assetId, isDialogOpen]);

  const {
    isExport1sDisabled,
    isExport10sDisabled,
    exportRequestType,
    isExportRangeTooBig,
    isExportButtonDisabled,
    onExportRequestTypeSet,
    emptyStages,
  } = useExportRangeValidation({ timeRangeType, timeRange, selectedStages, stageTimes });

  const { handleExport, isLoading } = useCsvExport({
    onCancel,
    timeRangeType,
    timeRange,
    selectedStages,
    assetId,
    stageTimes,
    companyId,
    latestWitsData,
    isLive,
    exportRequestType,
  });

  const allStages = useMemo(() => {
    return stageTimes.map(record => ({
      key: record.stage_number,
      name: `Stage ${record.stage_number}`,
    }));
  }, [stageTimes]);

  const handleDateChange = (key, value) => {
    setTimeRange({
      ...timeRange,
      [key]: value,
    });
  };

  let stagesErrorMessage = isExportRangeTooBig && 'Up to 50 stages available';
  if (
    timeRangeType === 'specificStages' &&
    !isExportRangeTooBig &&
    selectedStages.length > 0 &&
    emptyStages.length > 0
  ) {
    stagesErrorMessage = `No data available for Stages ${parseDropdownRangeArray(emptyStages)}`;
  }

  return (
    <Modal
      open={isDialogOpen}
      onClose={onCancel}
      title="Export Data"
      contentClassName={classes.modalContainer}
      actions={
        <>
          <CancelButton color="primary" onClick={onCancel}>
            Cancel
          </CancelButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleExport}
            disabled={isExportButtonDisabled || isLoading}
          >
            Export
          </StyledButton>
        </>
      }
    >
      <FormControl fullWidth>
        <InputLabel shrink htmlFor="selectTimeRange">
          Export type
        </InputLabel>
        <Select
          value={timeRangeType}
          inputProps={{ name: 'selectTimeRange', id: 'selectTimeRange' }}
          onChange={e => setTimeRangeType(e.target.value)}
        >
          {(isAssetViewer ? VIEWER_TIME_RANGE_TYPES : TIME_RANGE_TYPES).map(item => (
            <MenuItem value={item.key} key={item.key} disabled={item.disabled}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {timeRangeType === 'specificTimeRange' && (
        <div className={classes.datetimePickerContainer}>
          <DateTimePicker
            label="Date From"
            variant="inline"
            format={DATETIME_FORMAT}
            value={timeRange.from}
            onChange={value => handleDateChange('from', value)}
            className={classes.timeRangePicker}
          />
          <DateTimePicker
            label="Date To"
            variant="inline"
            format={DATETIME_FORMAT}
            value={timeRange.to}
            onChange={value => handleDateChange('to', value)}
            error={isExportRangeTooBig}
            helperText={isExportRangeTooBig && 'Invalid Range'}
            className={classes.timeRangePicker}
          />
        </div>
      )}
      {timeRangeType === 'specificStages' && (
        <div className={classes.stagesContainer}>
          <DropdownRange
            paramList={allStages}
            paramName="specificStages"
            label="Stages"
            value={selectedStages}
            onChange={(_key, value) => setSelectedStages(value)}
            error={stagesErrorMessage}
          />
        </div>
      )}
      <div className={classes.exportTimeRangeRequest}>
        <FormControl component="fieldset">
          <RadioGroup name="line-style" value={exportRequestType}>
            <FormControlLabel
              value={METADATA.collections.wits}
              control={<Radio />}
              disabled={isExport1sDisabled}
              label={
                <>
                  <span>1 second data </span>
                  <span className={classes.exportTimeRangeRequestLabel}>
                    available for up to
                    {`${
                      timeRangeType === TIME_RANGES.specificTimeRange.key ? ' 1 day' : ' 5 stages'
                    }`}
                  </span>
                </>
              }
              onChange={() => onExportRequestTypeSet(METADATA.collections.wits)}
            />
            <FormControlLabel
              value={METADATA.collections.wits10s}
              control={<Radio />}
              disabled={isExport10sDisabled}
              label={
                <>
                  <span>10 seconds data </span>
                  <span className={classes.exportTimeRangeRequestLabel}>
                    available for up to
                    {`${
                      timeRangeType === TIME_RANGES.specificTimeRange.key ? ' 7 days' : ' 50 stages'
                    }`}
                  </span>
                </>
              }
              onChange={() => onExportRequestTypeSet(METADATA.collections.wits10s)}
            />
          </RadioGroup>
        </FormControl>
      </div>
    </Modal>
  );
}

CSVExportDialog.propTypes = {
  currentAsset: PropTypes.shape({
    asset_id: PropTypes.number,
  }).isRequired,
  companyId: PropTypes.number,
  latestWitsData: PropTypes.shape({
    timestamp: PropTypes.number,
  }).isRequired,
  isLive: PropTypes.bool.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default memo(CSVExportDialog);
