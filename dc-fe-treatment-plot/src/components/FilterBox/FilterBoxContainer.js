import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { range } from 'lodash';
import { makeStyles } from '@material-ui/core';

import {
  CHEMICALS_VOL_LIST,
  CHEMICALS_MASS_LIST,
  PROPPANTS_CON_LIST,
  PROPPANTS_MASS_LIST,
  PRESSURE_LIST,
  RATE_LIST,
  TOTAL_VOLUME_LIST,
  STAGE_MODE,
  VIEWER_STAGE_MODE_KEYS,
  VIEW_MODE,
  VIEW_MODE_KEYS,
  REF_POINT,
  STAGE_MODE_KEYS,
  HORSEPOWER_LIST,
} from '../../constants';

import { useAppContext } from '@/context/AppContext';

import SingleDropdown from './SingleDropdown';
import DropdownRange from './DropdownRange';
import CategoryBox from './CategoryBox';
import CustomTimePicker from './CustomTimePicker';
import LastCustomTimeInput from './LastCustomTimeInput';

const useStyles = makeStyles({
  selectFilter: { left: '12px !important' },
  input: {
    marginBottom: 16,
  },
});

const resolveStageModes = (showManualStages, isAssetViewer) => {
  const stageModes = showManualStages
    ? STAGE_MODE
    : STAGE_MODE.filter(item => item.key !== STAGE_MODE_KEYS.manual);

  return isAssetViewer
    ? stageModes.filter(item => VIEWER_STAGE_MODE_KEYS.includes(item.key))
    : stageModes;
};

const resolveViewModes = isAssetViewer => {
  return isAssetViewer ? VIEW_MODE.filter(item => item.key === VIEW_MODE_KEYS.series) : VIEW_MODE;
};

function FilterBoxContainer(props) {
  const classes = useStyles();
  const {
    isPadMode,
    currentStage,
    showManualStages,
    filterSetting,
    dataSetting,
    mappedChemicals,
    offsetPressures,
    customChannels,
    graphColors,
    customTimeSetting,
    assetTimeLimits,
    onFilterSettingChange,
    onSettingChange,
  } = props;
  const { isAssetViewer } = useAppContext();
  const [showAddButtons, setShowAddButtons] = useState(false);

  const stageModeList = resolveStageModes(showManualStages, isAssetViewer);
  const viewModeList = resolveViewModes(isAssetViewer);

  const seriesCategories = useMemo(() => {
    const mappedChemicalsKeys = mappedChemicals.map(item => item.key);

    // NOTE: mappedChemicals always has total_friction_reducer key by default.
    const volumeChemicalsList = CHEMICALS_VOL_LIST.filter(item =>
      mappedChemicalsKeys.includes(item.key)
    );
    const massChemicalsList = CHEMICALS_MASS_LIST.filter(item =>
      mappedChemicalsKeys.includes(item.key)
    );
    return [
      {
        key: 'selectedPress',
        label: 'Pressures',
        list: PRESSURE_LIST,
        category: 'pressure',
      },
      {
        key: 'selectedOffsetPressure',
        label: 'Offset Pressures',
        list: offsetPressures,
        category: 'offsetPressure',
      },
      {
        key: 'selectedRate',
        label: 'Rates',
        list: RATE_LIST,
        category: 'rate',
      },
      {
        key: 'selectedHorsepower',
        label: 'Horsepower',
        list: HORSEPOWER_LIST,
        category: 'horsepower',
      },
      {
        key: 'selectedVolumeChemical',
        label: 'Volume Chemicals',
        list: volumeChemicalsList,
        category: 'chemical',
      },
      {
        key: 'selectedMassChemical',
        label: 'Mass Chemicals',
        list: massChemicalsList,
        category: 'chemical',
      },
      {
        key: 'selectedMassConcentrationProppant',
        label: 'Proppant Concentrations',
        list: PROPPANTS_CON_LIST,
        category: 'proppant',
      },
      {
        key: 'selectedMassProppant',
        label: 'Proppant Mass',
        list: PROPPANTS_MASS_LIST,
        category: 'proppant',
      },
      {
        key: 'selectedTotalVolume',
        label: 'Total Volumes',
        list: TOTAL_VOLUME_LIST,
        category: 'totalVolume',
      },
      {
        key: 'selectedCustomChannels',
        label: 'Custom Channels',
        list: customChannels,
        category: 'customChannels',
      },
    ];
  }, [offsetPressures, mappedChemicals, customChannels]);

  const handleSettingChange = (key, newValue) => {
    if (key === 'stageMode' && newValue === 'active') {
      const newFilterSetting = {
        ...filterSetting,
        stageMode: newValue,
        viewMode: 'series',
      };
      onFilterSettingChange(newFilterSetting);
    } else {
      const newFilterSetting = {
        ...filterSetting,
        [key]: newValue,
      };
      onFilterSettingChange(newFilterSetting);
    }
  };

  const handleDataSettingChange = (key, newValue) => {
    const newDataSetting = {
      ...dataSetting,
      [key]: newValue,
    };
    onSettingChange('dataSetting', newDataSetting);
  };

  const stages = range(1, currentStage + 1).map(stageNumber => ({
    name: `Stage ${stageNumber}`,
    key: stageNumber,
  }));

  return (
    <div
      className="c-tp-filter-container"
      data-testid="FilterBoxContainer"
      onMouseOver={() => setShowAddButtons(true)}
      onMouseOut={() => setShowAddButtons(false)}
      onFocus={() => setShowAddButtons(true)}
      onBlur={() => setShowAddButtons(false)}
    >
      <SingleDropdown
        paramList={stageModeList}
        paramName="stageMode"
        label="Stage Mode"
        value={filterSetting.stageMode || ''}
        dropdownMenuClass={classes.selectFilter}
        onChange={handleSettingChange}
      />
      {filterSetting.stageMode === STAGE_MODE_KEYS.lastCustomTime && (
        <LastCustomTimeInput
          value={filterSetting.lastCustomTime}
          className={classes.input}
          onChange={value => handleSettingChange('lastCustomTime', value)}
        />
      )}
      {filterSetting.stageMode === STAGE_MODE_KEYS.manual && (
        <DropdownRange
          paramList={stages}
          paramName="manualStages"
          label="Stages"
          value={filterSetting.manualStages}
          onChange={handleSettingChange}
        />
      )}
      {filterSetting.stageMode === STAGE_MODE_KEYS.activeCustom && (
        <CustomTimePicker
          isPadMode={isPadMode}
          customTimeSetting={customTimeSetting}
          assetTimeLimits={assetTimeLimits}
          onSettingChange={onSettingChange}
        />
      )}
      <SingleDropdown
        paramList={viewModeList}
        paramName="viewMode"
        label="View Mode"
        value={filterSetting.viewMode || ''}
        dropdownMenuClass={classes.selectFilter}
        onChange={handleSettingChange}
      />
      {filterSetting.viewMode === 'overlay' && (
        <SingleDropdown
          paramList={REF_POINT}
          paramName="refPoint"
          label="Reference Point"
          value={filterSetting.refPoint || ''}
          dropdownMenuClass={classes.selectFilter}
          onChange={handleSettingChange}
        />
      )}
      {seriesCategories.map(series => (
        <CategoryBox
          key={series.key}
          paramName={series.key}
          label={series.label}
          category={series.category}
          paramList={series.list}
          graphColors={graphColors}
          value={dataSetting[series.key]}
          showAddButtons={showAddButtons}
          onChange={handleDataSettingChange}
        />
      ))}
    </div>
  );
}

FilterBoxContainer.propTypes = {
  currentStage: PropTypes.number,
  showManualStages: PropTypes.bool.isRequired,
  isPadMode: PropTypes.bool.isRequired,
  filterSetting: PropTypes.shape({
    stageMode: PropTypes.string,
    lastCustomTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customActiveMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    viewMode: PropTypes.string,
    manualStages: PropTypes.array,
    refPoint: PropTypes.string,
  }).isRequired,
  customTimeSetting: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
  assetTimeLimits: PropTypes.shape({
    firstTimestamp: PropTypes.number,
    lastTimestamp: PropTypes.number,
  }).isRequired,
  dataSetting: PropTypes.shape({}).isRequired,
  mappedChemicals: PropTypes.arrayOf(PropTypes.object).isRequired,
  offsetPressures: PropTypes.arrayOf(PropTypes.object).isRequired,
  customChannels: PropTypes.arrayOf(PropTypes.object).isRequired,
  graphColors: PropTypes.shape({}).isRequired,
  onSettingChange: PropTypes.func.isRequired,
  onFilterSettingChange: PropTypes.func.isRequired,
};

FilterBoxContainer.defaultProps = {
  currentStage: null,
};

export default FilterBoxContainer;
