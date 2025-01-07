/* eslint-disable react/prop-types */
import { useContext, useMemo, useRef, useState } from 'react';
import { concat, sumBy } from 'lodash';

import { RealTimeSidebar } from '@corva/ui/components';

import {
  DEFAULT_RT_VALUES_SETTINGS,
  FRACTURE_GRADIENT_KEY,
  PERCENT_PROPPANT,
  RT_SIDEBAR_HORIZONTAL_HEIGH,
  RT_TYPES,
} from '@/constants';
import { LayoutContext } from '@/context/layoutContext';
import useCurrentStage from '@/effects/useCurrentStage';

const RealTimeSidebarContainer = props => {
  const {
    assetKey,
    stages,
    offsetPressures,
    customChannels,
    rtValuesSetting,
    onAppSettingChange,
    convertedWitsSubData,
    witsSubData,
    convertedTrackingSubData,
    convertedPredictionsSubData,
    abraChannelsData,
    statsData,
    isRealtimeSidebarOpen,
    onSettingChange,
    scaleSettings,
  } = props;

  const isReportsPage = window.location.pathname.startsWith('/reports/');

  const [isRealTimeDialogOpen, setIsRealTimeDialogOpen] = useState(false);
  const [isRealTimeSidebarOpen, setIsRealTimeSidebarOpen] = useState(
    isReportsPage ? true : isRealtimeSidebarOpen
  );
  const [paramToEdit, setParamToEdit] = useState('');
  const sidebarRef = useRef(null);

  const { state, dispatch: layoutStoreDispatch, isResponsive } = useContext(LayoutContext);
  const rtValues = concat(RT_TYPES, offsetPressures, customChannels, [PERCENT_PROPPANT]);

  const hasPercentProppant = rtValuesSetting?.some(item => item === PERCENT_PROPPANT.key);
  const currentStageData = useCurrentStage(
    witsSubData?.asset_id,
    stages,
    witsSubData?.stage_number,
    hasPercentProppant
  );

  const handleRealTimeSidebarOpenState = (isOpen: boolean) => {
    layoutStoreDispatch({ type: 'TOGGLE_REALTIME_SIDEBAR', value: isOpen });
    onSettingChange('isRealtimeSidebarOpen', isOpen);
    setIsRealTimeSidebarOpen(isOpen);
  };

  const onLayoutChange = height => {
    layoutStoreDispatch({
      type: 'SET_RT_SIDEBAR_HORIZONTAL_HEIGH',
      value: height,
    });
  };

  const handleRealTimeDialogOpenState = (isOpen: boolean) => setIsRealTimeDialogOpen(isOpen);
  const handleChangeParamToEdit = item => setParamToEdit(item);

  const sourceArray = useMemo(() => {
    const filteredSetting = (rtValuesSetting || DEFAULT_RT_VALUES_SETTINGS)
      .map(param => findSource(param, rtValues))
      .filter(item => item);
    return filteredSetting;
  }, [assetKey, rtValuesSetting, rtValues, convertedWitsSubData, convertedTrackingSubData, stages]);

  function findSource(paramKey, allTypes) {
    const type = allTypes.find(item => item.key === paramKey);
    const totalProppantMass = witsSubData?.data?.total_proppant_mass;

    if (!type) {
      return null;
    }

    const { collection, key, isArray, precision } = type;

    if (key === PERCENT_PROPPANT.key) {
      if (!currentStageData || !totalProppantMass) {
        return {
          ...type,
          value: 'N/A',
        };
      }
      const proppantSum = sumBy(currentStageData?.data.proppants, 'amount');
      if (proppantSum === 0) {
        return {
          ...type,
          value: 'N/A',
        };
      }

      const calculatedValue = (totalProppantMass / proppantSum) * 100;

      return {
        ...type,
        value: Number.isFinite(calculatedValue)
          ? parseFloat(calculatedValue.toFixed(Number.isFinite(precision) ? precision : 2))
          : '-',
      };
    }

    let data;

    if (collection === 'wits') {
      data = convertedWitsSubData;
    } else if (collection === 'prediction') {
      data = convertedPredictionsSubData;
    } else if (collection === 'stats') {
      data = statsData;
    } else if (collection === 'tracking') {
      data = convertedTrackingSubData;
    } else if (collection === 'abra') {
      data = abraChannelsData;
    }

    if (!data) {
      return type;
    }

    const [mainKey, subKey] = key.split('.');

    let value;

    if (isArray && data[mainKey]) {
      const lastItem = data[mainKey][data[mainKey].length - 1];
      value = lastItem ? lastItem[subKey] : null;
    } else {
      value = data[mainKey];
    }

    const unitTo = scaleSettings
      .reduce((result, setting) => (result = concat(result, setting.series)), [])
      .find(seriesItem => seriesItem.key === type.key)?.unitTo;

    if (key === FRACTURE_GRADIENT_KEY) {
      return {
        ...type,
        value: Number.isFinite(value) ? value : 'N/A',
        unitTo,
      };
    }

    if (collection !== 'tracking') {
      value = Number.isFinite(value)
        ? parseFloat(value.toFixed(Number.isFinite(precision) ? precision : 2))
        : '-';
    }

    return {
      ...type,
      value,
      unitTo,
    };
  }

  return (
    <RealTimeSidebar
      ref={sidebarRef}
      isResponsive={isResponsive}
      assetKey={assetKey}
      setting={rtValuesSetting || DEFAULT_RT_VALUES_SETTINGS}
      realTimeTypes={rtValues}
      isDialogOpen={isRealTimeDialogOpen}
      handleOpenCloseDialog={handleRealTimeDialogOpenState}
      isSidebarOpen={isRealTimeSidebarOpen}
      handleOpenCloseSidebar={handleRealTimeSidebarOpenState}
      onAppSettingChange={onAppSettingChange}
      appSettings={{ rtValuesSetting: { [assetKey]: rtValuesSetting } }}
      paramToEdit={paramToEdit}
      handleChangeParamToEdit={handleChangeParamToEdit}
      sourceArray={sourceArray}
      findSource={findSource}
      sidebarHorizontalHeight={RT_SIDEBAR_HORIZONTAL_HEIGH}
      onLayoutChange={onLayoutChange}
      state={state}
    />
  );
};

export default RealTimeSidebarContainer;
