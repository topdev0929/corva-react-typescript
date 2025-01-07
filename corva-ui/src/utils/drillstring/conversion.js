import { cloneDeep } from 'lodash';
import { getUnitPreference, convertValue } from '../convert';

const oneInch = convertValue(1, 'shortLength', 'in');
const oneInchI = convertValue(1, 'shortLength', getUnitPreference('shortLength'), 'in');

export function convertCommonFieldsToPref(component) {
  return {
    outer_diameter: convertValue(component.outer_diameter, 'shortLength', 'in'),
    inner_diameter: convertValue(component.inner_diameter, 'shortLength', 'in'),
    linear_weight: convertValue(component.linear_weight, 'massPerLength', 'lb-ft'),
    weight: convertValue(component.weight, 'mass', 'lb'),
    component_length: convertValue(component.component_length, 'length', 'ft'),
    length: convertValue(component.length, 'length', 'ft'),
    outer_diameter_tooljoint: convertValue(component.outer_diameter_tooljoint, 'shortLength', 'in'),
    inner_diameter_tooljoint: convertValue(component.inner_diameter_tooljoint, 'shortLength', 'in'),
    length_tooljoint: convertValue(component.length_tooljoint, 'length', 'ft'),
  };
}

export function convertPdmStabilizerToPref(stabilizer) {
  if (!stabilizer) {
    return stabilizer;
  }

  return {
    ...stabilizer,
    inner_diameter: convertValue(stabilizer.inner_diameter, 'shortLength', 'in'),
    outer_diameter: convertValue(stabilizer.outer_diameter, 'shortLength', 'in'),
    linear_weight: convertValue(stabilizer.linear_weight, 'massPerLength', 'lb-ft'),
    weight: convertValue(stabilizer.weight, 'mass', 'lb'),
    length: convertValue(stabilizer.length, 'length', 'ft'),
    gauge_od: convertValue(stabilizer.gauge_od, 'shortLength', 'in'),
    gauge_length: convertValue(stabilizer.gauge_length, 'shortLength', 'in'),
    blade_width: convertValue(stabilizer.blade_width, 'shortLength', 'in'),
    stab_centerpoint_to_bit: convertValue(stabilizer.stab_centerpoint_to_bit, 'length', 'ft'),
  };
}

export function convertPressureLossToPref(pressureLoss) {
  return (pressureLoss || []).map(item => {
    return {
      flow_rate: convertValue(item.flow_rate, 'volumeFlowRate', 'gal/min'),
      pressure_loss: convertValue(item.pressure_loss, 'pressure', 'psi'),
    };
  });
}

export function convertNozzleSizeToPref(nozzleSizes) {
  return (nozzleSizes || []).map(item => {
    return {
      ...item,
      size: oneInch !== 1 ? convertValue(item.size, 'shortLength', 'in') / 32 : item.size,
    };
  });
}

export function convertLwdMeasurementsToPref(measurements) {
  return (measurements || []).map(item => {
    return {
      ...item,
      distance: convertValue(item.distance, 'length', 'ft'),
    };
  });
}

export function convertBitToPref(component) {
  return {
    ...component,
    ...convertCommonFieldsToPref(component),
    size: convertValue(component.size, 'shortLength', 'in'),
    nozzle_sizes: convertNozzleSizeToPref(component.nozzle_sizes),
    tfa: oneInch !== 1 ? component.tfa * (oneInch * oneInch) : component.tfa,
  };
}

export function convertPdmToPref(component) {
  return {
    ...component,
    ...convertCommonFieldsToPref(component),
    max_weight_on_bit: convertValue(component.max_weight_on_bit, 'force', 'klbf'),
    min_standard_flowrate: convertValue(
      component.min_standard_flowrate,
      'volumeFlowRate',
      'gal/min'
    ),
    max_standard_flowrate: convertValue(
      component.max_standard_flowrate,
      'volumeFlowRate',
      'gal/min'
    ),
    max_operating_differential_pressure: convertValue(
      component.max_operating_differential_pressure,
      'pressure',
      'psi'
    ),
    torque_at_max_operating_differential_pressure: convertValue(
      component.torque_at_max_operating_differential_pressure,
      'torque',
      'ft-klbf'
    ),
    rpg: convertValue(component.rpg, 'revolutionPerVolume', 'rpg'),
    off_bottom_pressure_loss: convertPressureLossToPref(component.off_bottom_pressure_loss),
    stabilizer: convertPdmStabilizerToPref(component.stabilizer),
  };
}

export function convertLwdToPref(component) {
  return {
    ...component,
    ...convertCommonFieldsToPref(component),
    lwd_measurements: convertLwdMeasurementsToPref(component.lwd_measurements),
  };
}

export function convertStabilizerToPref(component) {
  return {
    ...component,
    ...convertCommonFieldsToPref(component),
    gauge_od: convertValue(component.gauge_od, 'shortLength', 'in'),
    gauge_length: convertValue(component.gauge_length, 'shortLength', 'in'),
    blade_width: convertValue(component.blade_width, 'shortLength', 'in'),
  };
}

export function convertMwdToPref(component) {
  return {
    ...component,
    ...convertCommonFieldsToPref(component),
    pressure_loss: convertPressureLossToPref(component.pressure_loss),
  };
}

export function convertRssToPref(component) {
  return {
    ...component,
    ...convertCommonFieldsToPref(component),
    pressure_loss: convertPressureLossToPref(component.pressure_loss),
  };
}

export function convertAgitatorToPref(component) {
  return {
    ...component,
    ...convertCommonFieldsToPref(component),
    pressure_loss: convertPressureLossToPref(component.pressure_loss),
  };
}

export function convertComponentToPref(component) {
  switch (component.family) {
    case 'dp':
    case 'hwdp':
    case 'dc':
    case 'jar':
    case 'sub':
      return {
        ...component,
        ...convertCommonFieldsToPref(component),
      };
    case 'bit':
      return convertBitToPref(component);
    case 'pdm':
      return convertPdmToPref(component);
    case 'lwd':
      return convertLwdToPref(component);
    case 'stabilizer':
      return convertStabilizerToPref(component);
    case 'mwd':
      return convertMwdToPref(component);
    case 'agitator':
      return convertAgitatorToPref(component);
    case 'rss':
      return convertRssToPref(component);
    default:
      return component;
  }
}

export function convertComponentsToPref(components) {
  const converted = cloneDeep(
    (components || []).map(component => convertComponentToPref(component))
  );

  if (!converted.length) {
    return converted;
  }

  if (converted[0].family === 'bit') {
    converted[0].c_length = converted[0].length || 0;
    for (let i = 1; i < converted.length; i += 1) {
      converted[i].c_length =
        parseFloat(converted[i - 1].c_length) + parseFloat(converted[i].length || 0);
    }
  } else {
    const lastIndex = converted.length - 1;
    converted[lastIndex].c_length = converted[lastIndex].length || 0;
    for (let i = lastIndex - 1; i >= 0; i -= 1) {
      converted[i].c_length =
        parseFloat(converted[i + 1].c_length) + parseFloat(converted[i].length || 0);
    }
  }

  return converted;
}

export function convertRecordToPref(record) {
  const { data } = record;
  return {
    ...record,
    data: {
      ...data,
      start_depth: convertValue(data.start_depth, 'length', 'ft'),
      end_depth: convertValue(data.end_depth, 'length', 'ft'),
      components: convertComponentsToPref(data.components),
    },
  };
}

export function convertCommonFieldsToImperial(component) {
  return {
    outer_diameter: convertValue(
      component.outer_diameter,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    inner_diameter: convertValue(
      component.inner_diameter,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    linear_weight: convertValue(
      component.linear_weight,
      'massPerLength',
      getUnitPreference('massPerLength'),
      'lb-ft'
    ),
    weight: convertValue(component.weight, 'mass', getUnitPreference('mass'), 'lb'),
    component_length: convertValue(
      component.component_length,
      'length',
      getUnitPreference('length'),
      'ft'
    ),
    length: convertValue(component.length, 'length', getUnitPreference('length'), 'ft'),
    outer_diameter_tooljoint: convertValue(
      component.outer_diameter_tooljoint,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    inner_diameter_tooljoint: convertValue(
      component.inner_diameter_tooljoint,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    length_tooljoint: convertValue(
      component.length_tooljoint,
      'length',
      getUnitPreference('length'),
      'ft'
    ),
  };
}

export function convertPdmStabilizerToImperial(stabilizer) {
  if (!stabilizer) {
    return stabilizer;
  }

  return {
    ...stabilizer,
    inner_diameter: convertValue(
      stabilizer.inner_diameter,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    outer_diameter: convertValue(
      stabilizer.outer_diameter,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    linear_weight: convertValue(
      stabilizer.linear_weight,
      'massPerLength',
      getUnitPreference('massPerLength'),
      'lb-ft'
    ),
    weight: convertValue(stabilizer.weight, 'mass', getUnitPreference('mass'), 'lb'),
    length: convertValue(stabilizer.length, 'length', getUnitPreference('length'), 'ft'),
    gauge_od: convertValue(
      stabilizer.gauge_od,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    gauge_length: convertValue(
      stabilizer.gauge_length,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    blade_width: convertValue(
      stabilizer.blade_width,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    stab_centerpoint_to_bit: convertValue(
      stabilizer.stab_centerpoint_to_bit,
      'length',
      getUnitPreference('length'),
      'ft'
    ),
  };
}

export function convertPressureLossToImperial(pressureLoss) {
  return (pressureLoss || []).map(item => {
    return {
      flow_rate: convertValue(
        item.flow_rate,
        'volumeFlowRate',
        getUnitPreference('volumeFlowRate'),
        'gal/min'
      ),
      pressure_loss: convertValue(
        item.pressure_loss,
        'pressure',
        getUnitPreference('pressure'),
        'psi'
      ),
    };
  });
}

export function convertLwdMeasurementsToImperial(measurements) {
  return (measurements || []).map(item => {
    return {
      ...item,
      distance: convertValue(item.distance, 'length', getUnitPreference('length'), 'ft'),
    };
  });
}

export function convertNozzleSizeToImperial(nozzleSizes) {
  return (nozzleSizes || []).map(item => {
    return {
      ...item,
      size:
        oneInchI !== 1
          ? convertValue(item.size, 'shortLength', getUnitPreference('shortLength'), 'in') * 32
          : item.size,
    };
  });
}

export function convertBitToImperial(component) {
  return {
    ...component,
    ...convertCommonFieldsToImperial(component),
    size: convertValue(component.size, 'shortLength', getUnitPreference('shortLength'), 'in'),
    nozzle_sizes: convertNozzleSizeToImperial(component.nozzle_sizes),
    tfa: oneInchI !== 1 ? component.tfa * (oneInchI * oneInchI) : component.tfa,
  };
}

export function convertPdmToImperial(component) {
  return {
    ...component,
    ...convertCommonFieldsToImperial(component),
    max_weight_on_bit: convertValue(
      component.max_weight_on_bit,
      'force',
      getUnitPreference('force'),
      'klbf'
    ),
    min_standard_flowrate: convertValue(
      component.min_standard_flowrate,
      'volumeFlowRate',
      getUnitPreference('volumeFlowRate'),
      'gal/min'
    ),
    max_standard_flowrate: convertValue(
      component.max_standard_flowrate,
      'volumeFlowRate',
      getUnitPreference('volumeFlowRate'),
      'gal/min'
    ),
    max_operating_differential_pressure: convertValue(
      component.max_operating_differential_pressure,
      'pressure',
      getUnitPreference('pressure'),
      'psi'
    ),
    torque_at_max_operating_differential_pressure: convertValue(
      component.torque_at_max_operating_differential_pressure,
      'torque',
      getUnitPreference('torque'),
      'ft-klbf'
    ),
    rpg: convertValue(
      component.rpg,
      'revolutionPerVolume',
      getUnitPreference('revolutionPerVolume'),
      'rpg'
    ),
    off_bottom_pressure_loss: convertPressureLossToImperial(component.off_bottom_pressure_loss),
    stabilizer: convertPdmStabilizerToImperial(component.stabilizer),
  };
}

export function convertLwdToImperial(component) {
  return {
    ...component,
    ...convertCommonFieldsToImperial(component),
    lwd_measurements: convertLwdMeasurementsToImperial(component.lwd_measurements),
  };
}

export function convertStabilizerToImperial(component) {
  return {
    ...component,
    ...convertCommonFieldsToImperial(component),
    gauge_od: convertValue(
      component.gauge_od,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    gauge_length: convertValue(
      component.gauge_length,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
    blade_width: convertValue(
      component.blade_width,
      'shortLength',
      getUnitPreference('shortLength'),
      'in'
    ),
  };
}

export function convertMwdToImperial(component) {
  return {
    ...component,
    ...convertCommonFieldsToImperial(component),
    pressure_loss: convertPressureLossToImperial(component.pressure_loss),
  };
}

export function convertRssToImperial(component) {
  return {
    ...component,
    ...convertCommonFieldsToImperial(component),
    pressure_loss: convertPressureLossToImperial(component.pressure_loss),
  };
}

export function convertAgitatorToImperial(component) {
  return {
    ...component,
    ...convertCommonFieldsToImperial(component),
    pressure_loss: convertPressureLossToImperial(component.pressure_loss),
  };
}

export function convertComponentToImperial(component) {
  switch (component.family) {
    case 'dp':
    case 'hwdp':
    case 'dc':
    case 'jar':
    case 'sub':
      return {
        ...component,
        ...convertCommonFieldsToImperial(component),
      };
    case 'bit':
      return convertBitToImperial(component);
    case 'pdm':
      return convertPdmToImperial(component);
    case 'lwd':
      return convertLwdToImperial(component);
    case 'stabilizer':
      return convertStabilizerToImperial(component);
    case 'mwd':
      return convertMwdToImperial(component);
    case 'agitator':
      return convertAgitatorToImperial(component);
    case 'rss':
      return convertRssToImperial(component);
    default:
      return component;
  }
}

export function convertComponentsToImperial(components) {
  return (components || []).map(component => convertComponentToImperial(component));
}
