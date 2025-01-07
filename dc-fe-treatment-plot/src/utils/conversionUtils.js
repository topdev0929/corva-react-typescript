import { round } from 'lodash';
import { convertValue, getUnitPreference } from '@corva/ui/utils';
import { GOALS_LIST } from '@/constants';

export const convertWitItem = (record, allSeriesTypes) => {
  return allSeriesTypes.reduce(
    (result, series) => {
      const { data } = record;
      const val = data[series.key];
      const convertedVal = convertValue(val, series.unitType, series.unit, series.unitTo);
      const formattedVal = Number.isFinite(convertedVal)
        ? round(convertedVal, series.precision)
        : convertedVal;

      return {
        ...result,
        [series.key]: formattedVal,
      };
    },
    {
      timestamp: record.timestamp,
    }
  );
};

export const convertPredictionItem = (record, allSeriesTypes) => {
  const { data, _id: id, timestamp } = record;
  const wellheadPressureSeries = allSeriesTypes.find(type => type.key === 'wellhead_pressure');
  const newBreakdown = (data.breakdown || []).map(item => {
    const pressure = convertValue(
      item.wellhead_pressure,
      wellheadPressureSeries.unitType,
      wellheadPressureSeries.unit,
      wellheadPressureSeries.unitTo
    );
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });
  const newIsip = (data.isip || []).map(item => {
    const pressure = convertValue(
      item.wellhead_pressure,
      wellheadPressureSeries.unitType,
      wellheadPressureSeries.unit,
      wellheadPressureSeries.unitTo
    );
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  const newOpenWellheadPressure = (data.opening_wellhead_pressure || []).map(item => {
    const pressure = convertValue(
      item.wellhead_pressure,
      wellheadPressureSeries.unitType,
      wellheadPressureSeries.unit,
      wellheadPressureSeries.unitTo
    );
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  const newTargetRampRate = (data.target_ramp_rate || []).map(item => {
    const pressure = convertValue(
      item.wellhead_pressure,
      wellheadPressureSeries.unitType,
      wellheadPressureSeries.unit,
      wellheadPressureSeries.unitTo
    );
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  return {
    ...data,
    fracture_gradient: convertValue(data.fracture_gradient, 'pressureGradient', 'psi/ft'),
    breakdown: newBreakdown,
    isip: newIsip,
    opening_wellhead_pressure: newOpenWellheadPressure,
    target_ramp_rate: newTargetRampRate,
    id,
    timestamp,
  };
};

export const convertPredictionItemBack = record => {
  const { id, timestamp, ...data } = record;

  const newBreakdown = (data.breakdown || []).map(item => {
    const pressure = convertValue(
      item.wellhead_pressure,
      'pressure',
      getUnitPreference('pressure'),
      'psi'
    );
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  const newIsip = (data.isip || []).map(item => {
    const pressure = convertValue(
      item.wellhead_pressure,
      'pressure',
      getUnitPreference('pressure'),
      'psi'
    );
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  const newRamp = (data.target_ramp_rate || []).map(item => {
    const pressure = convertValue(
      item.wellhead_pressure,
      'pressure',
      getUnitPreference('pressure'),
      'psi'
    );
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  const newOpenWellheadPressure = (data.opening_wellhead_pressure || []).map(item => {
    const pressure = convertValue(
      item.wellhead_pressure,
      'pressure',
      getUnitPreference('pressure'),
      'psi'
    );
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  return {
    data: {
      ...data,
      breakdown: newBreakdown,
      isip: newIsip,
      opening_wellhead_pressure: newOpenWellheadPressure,
      target_ramp_rate: newRamp,
    },
    timestamp,
    _id: id,
  };
};

export const convertFullWitItem = (record, allSeriesTypes) => {
  if (!record) return null;

  const { data } = record;

  const result = allSeriesTypes.reduce(
    (result, series) => {
      const val = data[series.key];
      const convertedVal = convertValue(val, series.unitType, series.unit, series.unitTo);
      const formattedVal = Number.isFinite(convertedVal)
        ? round(convertedVal, series.precision)
        : convertedVal;

      return {
        ...result,
        [series.key]: formattedVal,
      };
    },
    {
      timestamp: record.timestamp,
    }
  );

  return {
    ...result,
    hydraulic_horse_power: convertValue(data.hydraulic_horse_power, 'power', 'hp'),
  };
};

const convertTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
};

export const convertTrackingItem = record => {
  if (!record) return null;

  const { duration_for_surface_to_reach_bottom } = record?.data || {};

  return {
    duration_for_surface_to_reach_bottom: convertTime(duration_for_surface_to_reach_bottom),
  };
};

export const convertAbraItem = record => {
  if (!record) return null;

  const { data } = record;

  return {
    ...data,
    assetId: record.asset_id,
    id: record._id,
    stage: record.stage,
    timestamp: Math.floor(record.timestamp / 1000),
    pressure: convertValue(data.pressure, 'pressure', 'psi'),
  };
};

export const convertFullPredictionItem = record => {
  if (!record) return null;

  const { data } = record;

  const newBreakdown = (data.breakdown || []).map(item => {
    const pressure = convertValue(item.wellhead_pressure, 'pressure', 'psi');
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  const newTargetRampRate = (data.target_ramp_rate || []).map(item => {
    const pressure = convertValue(item.wellhead_pressure, 'pressure', 'psi');
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  const newIsip = (data.isip || []).map(item => {
    const pressure = convertValue(item.wellhead_pressure, 'pressure', 'psi');
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  const newOpenWellheadPressure = (data.opening_wellhead_pressure || []).map(item => {
    const pressure = convertValue(item.wellhead_pressure, 'pressure', 'psi');
    return {
      ...item,
      wellhead_pressure: pressure,
    };
  });

  return {
    ...data,
    breakdown: newBreakdown,
    target_ramp_rate: newTargetRampRate,
    isip: newIsip,
    opening_wellhead_pressure: newOpenWellheadPressure,
    max_treating_pressure: convertValue(data.max_treating_pressure, 'pressure', 'psi'),
    ave_treating_pressure: convertValue(data.ave_treating_pressure, 'pressure', 'psi'),
    max_flow_rate: convertValue(data.max_flow_rate, 'oilFlowRate', 'bbl/min'),
    ave_pumping_rate: convertValue(data.ave_pumping_rate, 'oilFlowRate', 'bbl/min'),
    fracture_gradient: convertValue(data.fracture_gradient, 'pressureGradient', 'psi/ft'),
  };
};

export const convertActivityItem = record => {
  if (record.data && record.data.activities) {
    return record.data.activities;
  } else if (record.activities) {
    return record.activities;
  }

  return [];
};

export const convertGoals = rawGoals => {
  if (!rawGoals) {
    return {};
  }

  const result = {};
  const { data = {} } = rawGoals;

  GOALS_LIST.forEach(goal => {
    const minKey = `min_goal_${goal.key}`;
    const maxKey = `max_goal_${goal.key}`;
    result[minKey] = convertValue(data[minKey], goal.unitType, goal.unit);
    result[maxKey] = convertValue(data[maxKey], goal.unitType, goal.unit);
  });

  return result;
};
