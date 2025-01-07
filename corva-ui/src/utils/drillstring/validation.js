import moment from 'moment';
import { isEmpty, omit, maxBy } from 'lodash';
import { getUnitPreference, convertValue, getUnitDisplay } from '../convert';

const ALLOWED_DIFF_OD_BIT_SIZE = 0.1;

const DEF_MIN_ID = 0;
const DEF_MAX_ID = 100;
const DEF_MIN_OD = 1;
const DEF_MAX_OD = 100;
const DEF_MIN_LENGTH = 0;

const UR_MIN_ID = 0;
const UR_MAX_ID = 50;
const UR_MIN_BODY_OD = 1;
const UR_MAX_BODY_OD = 50;
const UR_MIN_OPENED_OD = 1;
const UR_MAX_OPENED_OD = 50;

const CT_MIN_ID = 0;
const CT_MAX_ID = 100;
const CT_MIN_OD = 1;
const CT_MAX_OD = 100;
const CT_MIN_RD = 0;
const CT_MAX_RD = 500;
const CT_MIN_LENGTH = 0;

const DP_MIN_ID = 1;
const DP_MAX_ID = 7;
const DP_MIN_OD = 2;
const DP_MAX_OD = 8;
const DP_MIN_TJ_ID = 1;
const DP_MAX_TJ_ID = 7;
const DP_MIN_TJ_OD = 2;
const DP_MAX_TJ_OD = 10;
const DP_MIN_LENGTH = 0;

const HWDP_MIN_ID = 1;
const HWDP_MAX_ID = 7;
const HWDP_MIN_OD = 2;
const HWDP_MAX_OD = 8;
const HWDP_MIN_TJ_ID = 1;
const HWDP_MAX_TJ_ID = 7;
const HWDP_MIN_TJ_OD = 2;
const HWDP_MAX_TJ_OD = 10;
const HWDP_MIN_LENGTH = 0;

const DC_MIN_ID = 0.5;
const DC_MAX_ID = 7;
const DC_MIN_OD = 2;
const DC_MAX_OD = 13;
const DC_MIN_LENGTH = 0;

const STABLE_MIN_ID = 0;
const STABLE_MAX_ID = 100;
const STABLE_MIN_OD = 1;
const STABLE_MAX_OD = 100;
const STABLE_MIN_LENGTH = 0;

const PDM_MIN_OD = 2;
const PDM_MAX_OD = 15;
const PDM_MIN_ID = 0;
const PDM_MAX_ID = 12;
const PDM_MIN_LENGTH = 4;

const PDM_MIN_STATOR = 2;
const PDM_MAX_STATOR = 10;
const PDM_MIN_ROTOR = 1;
const PDM_MAX_ROTOR = 10;
const PDM_MIN_RPG = 0;
const PDM_MAX_RPG = 10;
const PDM_MIN_WOB = 0;
const PDM_MAX_WOB = 200;
const PDM_MIN_FLOW_RANGE = 0;
const PDM_MAX_FLOW_RANGE = 2500;
const PDM_MIN_MODP = 0;
const PDM_MAX_MODP = 3000;
const PDM_MIN_TMODP = 0;
const PDM_MAX_TMODP = 40;
const PDM_MIN_FLOW_LOSS = 0;
const PDM_MAX_FLOW_LOSS = 20;
const PDM_MIN_OFF_BOTTOM_PRESSURE_LOSS = 0;

const MWD_MIN_ID = 0;
const MWD_MAX_ID = 12;
const MWD_MIN_OD = 2;
const MWD_MAX_OD = 13;
const MWD_MIN_LENGTH = 1.0;
const MWD_MIN_PRESSURE_LOSS = 0;

const LWD_MIN_ID = 0.1;
const LWD_MAX_ID = 7;
const LWD_MIN_OD = 2;
const LWD_MAX_OD = 9.5;
const LWD_MIN_LENGTH = 1.0;

const RSS_MIN_ID = 0;
const RSS_MAX_ID = 12;
const RSS_MIN_OD = 2;
const RSS_MAX_OD = 13;
const RSS_MIN_LENGTH = 1.0;
const RSS_MIN_FLOW_LOSS = 0;
const RSS_MAX_FLOW_LOSS = 10;
const RSS_MIN_PRESSURE_LOSS = 0;

const AGITATOR_MIN_ID = 0;
const AGITATOR_MAX_ID = 12;
const AGITATOR_MIN_OD = 2;
const AGITATOR_MAX_OD = 13;
const AGITATOR_MIN_LENGTH = 1.0;
const AGITATOR_MIN_PRESSURE_LOSS = 0;

const BIT_MIN_TFA = 0;
const BIT_MAX_TFA = 20;

const DEPTH_IN_HOLE_MIN = 0;
const DEPTH_IN_HOLE_MAX = 55000;
const DEPTH_IN_HOLE_PROHIBITED = 1;

const NULL_ERROR = { general: { empty: 'It should not be empty.' } };
const FAMILY_ERROR = { general: { family: 'Family should be matched.' } };

export function ctoi(val, unitType, unit, precision = 2) {
  if (val === null || typeof val === 'undefined') {
    return null;
  }
  if (!unitType || !unit) {
    return parseFloat(val);
  }
  return parseFloat(convertValue(val, unitType, getUnitPreference(unitType), unit, precision));
}

export function ctop(val, unitType, unit, precision = 2) {
  if (val !== 0 && !val) {
    return null;
  }
  return unitType && unit ? convertValue(val, unitType, unit, null, precision) : val;
}

export function isValueEmpty(val) {
  return val === null || typeof val === 'undefined' || val === '';
}

export function isValidNumber(num, min, max, { isMinInclusive = true } = {}) {
  const parsedNum = parseFloat(num);
  if (Number.isNaN(parsedNum)) return false;
  if ((isMinInclusive && parsedNum < min) || (!isMinInclusive && parsedNum <= min)) {
    return false;
  }
  if (max && parsedNum > max) return false;
  return true;
}

export function isValidLinearWeight(id, od, linearWeight) {
  const prefShortLengthUnit = getUnitPreference('shortLength');
  let convertedId = id;
  let convertedOd = od;
  if (prefShortLengthUnit !== 'in') {
    convertedId = convertValue(id, 'shortLength', prefShortLengthUnit, 'in');
    convertedOd = convertValue(od, 'shortLength', prefShortLengthUnit, 'in');
  }
  const estimation = 2.673 * (convertedOd * convertedOd - convertedId * convertedId);
  const convertedEstimation =
    prefShortLengthUnit !== 'in' ? convertValue(estimation, 'massPerLength', 'lb-ft') : estimation;
  return linearWeight >= convertedEstimation * 0.5 && linearWeight <= convertedEstimation * 1.5;
}

export function validateCommon(comp, baseParams, bitSize = null) {
  if (!comp || !baseParams) return NULL_ERROR;

  const {
    min_id,
    min_od,
    max_id,
    max_od,
    min_length,
    min_tj_id,
    max_tj_id,
    min_tj_od,
    max_tj_od,
    min_pressure_loss,
    min_off_bottom_pressure_loss,
  } = baseParams;

  const shortLengthUnitDisplay = getUnitDisplay('shortLength');
  const error = {};
  let hasErrors = false;

  if (!isValueEmpty(min_id) && !isValueEmpty(min_od)) {
    if (!isValidNumber(comp.inner_diameter, min_id, max_id)) {
      error.inner_diameter = `${min_id.toFixed(1)}~${max_id.toFixed(
        1
      )} (${shortLengthUnitDisplay})`;
      hasErrors = true;
    }

    if (!isValidNumber(comp.outer_diameter, min_od, max_od)) {
      error.outer_diameter = `${min_od.toFixed(1)}~${max_od.toFixed(
        1
      )} (${shortLengthUnitDisplay})`;
      hasErrors = true;
    }

    if (
      isValidNumber(comp.inner_diameter, min_id, max_id) &&
      isValidNumber(comp.outer_diameter, min_od, max_od) &&
      !isValidNumber(comp.inner_diameter, min_id, comp.outer_diameter)
    ) {
      error.outer_diameter = 'O.D > I.D';
      hasErrors = true;
    }

    if (!error.outer_diameter && bitSize) {
      if (
        +comp.outer_diameter + convertValue(ALLOWED_DIFF_OD_BIT_SIZE, 'shortLength', 'in') >
        bitSize
      ) {
        error.outer_diameter = ' O.D + 0.1 < Bit Size';
        hasErrors = true;
      }
    }
  
    // only check validity of linear weight when family is not bit
    if (!isValidNumber(comp.linear_weight, 0)) {
      error.linear_weight = 'Invalid value';
      hasErrors = true;
    }
  }

  if (!isValueEmpty(min_tj_id) && !isValueEmpty(min_tj_od)) {
    if (!isValidNumber(comp.inner_diameter_tooljoint, min_tj_id, max_tj_id)) {
      error.inner_diameter_tooljoint = `${min_tj_id.toFixed(1)}~${max_tj_id.toFixed(
        1
      )} (${shortLengthUnitDisplay})`;
      hasErrors = true;
    }

    if (!isValidNumber(comp.outer_diameter_tooljoint, min_tj_od, max_tj_od)) {
      error.outer_diameter_tooljoint = `${min_tj_od.toFixed(1)}~${max_tj_od.toFixed(
        1
      )} (${shortLengthUnitDisplay})`;
      hasErrors = true;
    }

    if (!isValidNumber(comp.outer_diameter_tooljoint, comp.outer_diameter, max_tj_od)) {
      error.outer_diameter_tooljoint = 'Tool Joint O.D >= O.D';
      hasErrors = true;
    }
  }

  if (!isValueEmpty(min_length)) {
    if (!isValidNumber(comp.length, min_length)) {
      error.length = 'Invalid value';
      hasErrors = true;
    }
  }

  if (!isValueEmpty(comp.length_tooljoint) && !isValueEmpty(comp.component_length)) {
    if (+comp.length_tooljoint > +comp.component_length) {
      error.length_tooljoint = 'Tool Joint Length < Component Length';
      hasErrors = true;
    }
  }

  if (comp.off_bottom_pressure_loss && comp.off_bottom_pressure_loss.length > 0) {
    error.off_bottom_pressure_loss = {};
    for (let j = 0; j < comp.off_bottom_pressure_loss.length; j += 1) {
      const obpsItem = comp.off_bottom_pressure_loss[j];
      error.off_bottom_pressure_loss[j] = {};
      if (isValueEmpty(obpsItem.flow_rate)) {
        error.off_bottom_pressure_loss[j].flow_rate = 'flow rate is required.';
        hasErrors = true;
      }
      if (isValueEmpty(obpsItem.pressure_loss)) {
        error.off_bottom_pressure_loss[j].pressure_loss = 'pressure loss is required.';
        hasErrors = true;
      }
      if (
        !isValueEmpty(min_off_bottom_pressure_loss) &&
        !isValidNumber(obpsItem.pressure_loss, min_off_bottom_pressure_loss, null, {
          isMinInclusive: false,
        })
      ) {
        error.off_bottom_pressure_loss[j].pressure_loss = 'Invalid range';
        hasErrors = true;
      }
    }
  }

  if (comp.pressure_loss && comp.pressure_loss.length > 0) {
    error.pressure_loss = {};
    for (let j = 0; j < comp.pressure_loss.length; j += 1) {
      const pressureLossItem = comp.pressure_loss[j];
      error.pressure_loss[j] = {};
      if (isValueEmpty(pressureLossItem.flow_rate)) {
        error.pressure_loss[j].flow_rate = 'flow rate is required.';
        hasErrors = true;
      }
      if (isValueEmpty(pressureLossItem.pressure_loss)) {
        error.pressure_loss[j].pressure_loss = 'pressure loss is required.';
        hasErrors = true;
      }
      if (
        !isValueEmpty(min_pressure_loss) &&
        !isValidNumber(pressureLossItem.pressure_loss, min_pressure_loss, null, {
          isMinInclusive: false,
        })
      ) {
        error.pressure_loss[j].pressure_loss = 'Invalid range';
        hasErrors = true;
      }
    }
  }

  if (comp.has_stabilizer && comp.stabilizer) {
    const stabMinId = convertValue(STABLE_MIN_ID, 'shortLength', 'in');
    const stabMaxId = convertValue(STABLE_MAX_ID, 'shortLength', 'in');
    const stabMinOd = convertValue(STABLE_MIN_OD, 'shortLength', 'in');
    const stabMaxOd = convertValue(STABLE_MAX_OD, 'shortLength', 'in');
    const stabMinLength = convertValue(STABLE_MIN_LENGTH, 'length', 'ft');

    if (
      isValidNumber(comp.stabilizer.inner_diameter, stabMinId, stabMaxId) &&
      isValidNumber(comp.stabilizer.outer_diameter, stabMinOd, stabMaxOd) &&
      !isValidNumber(comp.stabilizer.inner_diameter, min_id, comp.stabilizer.outer_diameter)
    ) {
      error.stabilizer_outer_diameter = 'O.D > I.D';
      hasErrors = true;
    }

    if (!isValidNumber(comp.stabilizer.inner_diameter, stabMinId, stabMaxId)) {
      error.stabilizer_inner_diameter = `${stabMinId.toFixed(1)}~${stabMaxId.toFixed(
        1
      )} (${shortLengthUnitDisplay})`;
      hasErrors = true;
    }
    if (!isValidNumber(comp.stabilizer.outer_diameter, stabMinOd, stabMaxOd)) {
      error.stabilizer_outer_diameter = `${stabMinOd.toFixed(1)}~${stabMaxOd.toFixed(
        1
      )} (${shortLengthUnitDisplay})`;
      hasErrors = true;
    }
    if (!isValueEmpty(stabMinLength)) {
      if (!isValidNumber(comp.stabilizer.length, stabMinLength)) {
        error.stabilizer_length = 'Invalid value';
        hasErrors = true;
      }
    }
    if (isValueEmpty(comp.stabilizer.linear_weight)) {
      error.stabilizer_linear_weight = 'Invalid value';
      hasErrors = true;
    }
    if (!error.stabilizer_outer_diameter && bitSize) {
      if (
        +comp.stabilizer.outer_diameter +
          convertValue(ALLOWED_DIFF_OD_BIT_SIZE, 'shortLength', 'in') >
        bitSize
      ) {
        error.stabilizer_outer_diameter = ' O.D + 0.1 < Bit Size';
        hasErrors = true;
      }
    }
  }

  return hasErrors ? error : null;
}

export function validateHeader(header) {
  if (!header) return NULL_ERROR;
  const lengthUnitDisplay = getUnitDisplay('length');
  const errors = {};

  if (isValueEmpty(header.id)) {
    errors.id = 'It should not be empty.';
  }
  if (header.start_timestamp_str && !moment(new Date(header.start_timestamp_str)).isValid()) {
    errors.start_timestamp = 'Invalid Date.';
  }
  if (Number.isFinite(header.start_depth)) {
    const minDepth = convertValue(DEPTH_IN_HOLE_MIN, 'length', 'ft');
    const maxDepth = convertValue(DEPTH_IN_HOLE_MAX, 'length', 'ft');
    const prohibitedDepth = convertValue(DEPTH_IN_HOLE_PROHIBITED, 'length', 'ft');
    if (header.start_depth <= minDepth || header.start_depth > maxDepth) {
      errors.start_depth = `Should be a positive number ${minDepth.toFixed(2)}~${maxDepth.toFixed(
        2
      )} (${lengthUnitDisplay})`;
    }
    if (header.start_depth === prohibitedDepth) {
      errors.start_depth = `Should not be equal to ${prohibitedDepth} (${lengthUnitDisplay})`;
    }
  } else {
    errors.start_depth = 'It should not be empty.';
  }

  return isEmpty(errors) ? null : errors;
}

export function validateComponentDefaullt(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  const baseParams = {
    min_id: convertValue(DEF_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(DEF_MAX_ID, 'shortLength', 'in'),
    min_od: convertValue(DEF_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(DEF_MAX_OD, 'shortLength', 'in'),
    min_length: convertValue(DEF_MIN_LENGTH, 'length', 'ft'),
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentDp(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'dp') return FAMILY_ERROR;

  const baseParams = {
    min_id: convertValue(DP_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(DP_MAX_ID, 'shortLength', 'in'),
    min_od: convertValue(DP_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(DP_MAX_OD, 'shortLength', 'in'),
    min_tj_id: convertValue(DP_MIN_TJ_ID, 'shortLength', 'in'),
    max_tj_id: convertValue(DP_MAX_TJ_ID, 'shortLength', 'in'),
    min_tj_od: convertValue(DP_MIN_TJ_OD, 'shortLength', 'in'),
    max_tj_od: convertValue(DP_MAX_TJ_OD, 'shortLength', 'in'),
    min_length: convertValue(DP_MIN_LENGTH, 'length', 'ft'),
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  if (!error.inner_diameter && !error.outer_diameter && !error.linear_weight) {
    if (
      !isValidLinearWeight(
        component.inner_diameter,
        component.outer_diameter,
        component.linear_weight
      )
    ) {
      error.linear_weight = 'Invalid range';
    }
  }
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentHwdp(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'hwdp') return FAMILY_ERROR;

  const baseParams = {
    min_id: convertValue(HWDP_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(HWDP_MAX_ID, 'shortLength', 'in'),
    min_od: convertValue(HWDP_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(HWDP_MAX_OD, 'shortLength', 'in'),
    min_tj_id: convertValue(HWDP_MIN_TJ_ID, 'shortLength', 'in'),
    max_tj_id: convertValue(HWDP_MAX_TJ_ID, 'shortLength', 'in'),
    min_tj_od: convertValue(HWDP_MIN_TJ_OD, 'shortLength', 'in'),
    max_tj_od: convertValue(HWDP_MAX_TJ_OD, 'shortLength', 'in'),
    min_length: convertValue(HWDP_MIN_LENGTH, 'length', 'ft'),
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  if (!error.inner_diameter && !error.outer_diameter && !error.linear_weight) {
    if (
      !isValidLinearWeight(
        component.inner_diameter,
        component.outer_diameter,
        component.linear_weight
      )
    ) {
      error.linear_weight = 'Invalid range';
    }
  }
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentDc(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'dc') return FAMILY_ERROR;

  const baseParams = {
    min_id: convertValue(DC_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(DC_MAX_ID, 'shortLength', 'in'),
    min_od: convertValue(DC_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(DC_MAX_OD, 'shortLength', 'in'),
    min_length: convertValue(DC_MIN_LENGTH, 'length', 'ft'),
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  if (!error.inner_diameter && !error.outer_diameter && !error.linear_weight) {
    if (
      !isValidLinearWeight(
        component.inner_diameter,
        component.outer_diameter,
        component.linear_weight
      )
    ) {
      error.linear_weight = 'Invalid range';
    }
  }
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentJar(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  return component.family !== 'jar' ? FAMILY_ERROR : validateComponentDefaullt(component, bitSize);
}

export function validateComponentSub(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  return component.family !== 'sub' ? FAMILY_ERROR : validateComponentDefaullt(component, bitSize);
}

export function validateComponentBit(component, maxOd = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'bit') return FAMILY_ERROR;

  const bitSize = component.size;
  const commonErrors = validateCommon(component, {}, bitSize);
  const error = commonErrors || {};
  const ratio = ctop(1, 'shortLength', 'in');
  const lowerLimit = BIT_MIN_TFA * (ratio * ratio);
  const upperLimit = BIT_MAX_TFA * (ratio * ratio);

  if (!isValueEmpty(maxOd) && !isValueEmpty(bitSize)) {
    if (
      +maxOd + convertValue(ALLOWED_DIFF_OD_BIT_SIZE, 'shortLength', 'in') >
      bitSize
    ) {
      error.size = ' max(O.D) + 0.1 < Bit Size';
    }
  }
  if (!isValidNumber(component.tfa, lowerLimit, upperLimit)) {
    error.tfa = `TFA must be ${lowerLimit.toFixed(2)}~${BIT_MAX_TFA.toFixed(2)}`;
  }

  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentPdm(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'pdm') return FAMILY_ERROR;

  const baseParams = {
    min_od: convertValue(PDM_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(PDM_MAX_OD, 'shortLength', 'in'),
    min_id: convertValue(PDM_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(PDM_MAX_ID, 'shortLength', 'in'),
    min_length: convertValue(PDM_MIN_LENGTH, 'length', 'ft'),
    min_off_bottom_pressure_loss: PDM_MIN_OFF_BOTTOM_PRESSURE_LOSS,
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};

  let pdmFieldUnitLower;
  let pdmFieldUnitUpper;

  if (!isValidNumber(component.number_rotor_lobes, PDM_MIN_ROTOR, PDM_MAX_ROTOR)) {
    error.number_rotor_lobes = `It must be ${PDM_MIN_ROTOR}~${PDM_MAX_ROTOR}`;
  }

  if (!isValidNumber(component.number_stator_lobes, PDM_MIN_STATOR, PDM_MAX_STATOR)) {
    error.number_stator_lobes = `It must be ${PDM_MIN_STATOR}~${PDM_MAX_STATOR}`;
  }

  if (!isValidNumber(component.rpg, PDM_MIN_RPG, PDM_MAX_RPG)) {
    error.rpg = `It must be ${PDM_MIN_RPG}~${PDM_MAX_RPG}`;
  }

  pdmFieldUnitLower = convertValue(PDM_MIN_WOB, 'force', 'klbf');
  pdmFieldUnitUpper = convertValue(PDM_MAX_WOB, 'force', 'klbf');
  if (
    !isValueEmpty(component.max_weight_on_bit) &&
    !isValidNumber(component.max_weight_on_bit, pdmFieldUnitLower, pdmFieldUnitUpper)
  ) {
    error.max_weight_on_bit = `It must be ${pdmFieldUnitUpper.toFixed(
      2
    )}~${pdmFieldUnitUpper.toFixed(2)}`;
  }

  pdmFieldUnitLower = convertValue(PDM_MIN_FLOW_RANGE, 'volumeFlowRate', 'gal/min');
  pdmFieldUnitUpper = convertValue(PDM_MAX_FLOW_RANGE, 'volumeFlowRate', 'gal/min');
  if (!isValidNumber(component.min_standard_flowrate, pdmFieldUnitLower, pdmFieldUnitUpper)) {
    error.min_standard_flowrate = `It must be ${pdmFieldUnitLower.toFixed(
      2
    )}~${pdmFieldUnitUpper.toFixed(2)}`;
  }

  if (!isValidNumber(component.max_standard_flowrate, pdmFieldUnitLower, pdmFieldUnitUpper)) {
    error.max_standard_flowrate = `It must be ${pdmFieldUnitLower.toFixed(
      2
    )}~${pdmFieldUnitUpper.toFixed(2)}`;
  }

  pdmFieldUnitLower = convertValue(PDM_MIN_MODP, 'pressure', 'psi');
  pdmFieldUnitUpper = convertValue(PDM_MAX_MODP, 'pressure', 'psi');
  if (
    !isValidNumber(
      component.max_operating_differential_pressure,
      pdmFieldUnitLower,
      pdmFieldUnitUpper
    )
  ) {
    error.max_operating_differential_pressure = `It must be ${pdmFieldUnitLower.toFixed(
      2
    )}~${pdmFieldUnitUpper.toFixed(2)}`;
  }

  pdmFieldUnitLower = convertValue(PDM_MIN_TMODP, 'torque', 'ft-klbf');
  pdmFieldUnitUpper = convertValue(PDM_MAX_TMODP, 'torque', 'ft-klbf');
  if (
    !isValidNumber(
      component.torque_at_max_operating_differential_pressure,
      pdmFieldUnitLower,
      pdmFieldUnitUpper
    )
  ) {
    error.torque_at_max_operating_differential_pressure = `It must be ${pdmFieldUnitLower.toFixed(
      2
    )}~${pdmFieldUnitUpper.toFixed(2)}`;
  }

  if (!isValidNumber(component.flow_loss_percentage, PDM_MIN_FLOW_LOSS, PDM_MAX_FLOW_LOSS)) {
    error.flow_loss_percentage = `It must be ${PDM_MIN_FLOW_LOSS}~${PDM_MAX_FLOW_LOSS}`;
  }

  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentLwd(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'lwd') return FAMILY_ERROR;

  const baseParams = {
    min_od: convertValue(LWD_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(LWD_MAX_OD, 'shortLength', 'in'),
    min_id: convertValue(LWD_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(LWD_MAX_ID, 'shortLength', 'in'),
    min_length: convertValue(LWD_MIN_LENGTH, 'length', 'ft'),
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  let hasErrors = false;
  if (commonErrors) hasErrors = true;

  if (component.lwd_measurements && component.lwd_measurements.length > 0) {
    error.lwd_measurements = {};
    for (let j = 0; j < component.lwd_measurements.length; j += 1) {
      const lwdMeasurementItem = component.lwd_measurements[j];
      error.lwd_measurements[j] = {};
      if (isValueEmpty(lwdMeasurementItem.type)) {
        error.lwd_measurements[j].type = 'measurement type is required.';
        hasErrors = true;
      }
      if (isValueEmpty(lwdMeasurementItem.distance)) {
        error.lwd_measurements[j].distance = 'measurement distance is required.';
        hasErrors = true;
      }
    }
  }

  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };
  if (!component.lwd_measurements || !component.lwd_measurements.length) {
    errors.general.lwd_measurements =
      'LWD Tool requires at least one LWD measurement should be selected.';
    hasErrors = true;
  }

  return hasErrors ? errors : null;
}

export function validateComponentStabilizer(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'stabilizer') return FAMILY_ERROR;

  const baseParams = {
    min_id: convertValue(STABLE_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(STABLE_MAX_ID, 'shortLength', 'in'),
    min_od: convertValue(STABLE_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(STABLE_MAX_OD, 'shortLength', 'in'),
    min_length: convertValue(STABLE_MIN_LENGTH, 'length', 'ft'),
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentMwd(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'mwd') return FAMILY_ERROR;

  const baseParams = {
    min_od: convertValue(MWD_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(MWD_MAX_OD, 'shortLength', 'in'),
    min_id: convertValue(MWD_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(MWD_MAX_ID, 'shortLength', 'in'),
    min_length: convertValue(MWD_MIN_LENGTH, 'length', 'ft'),
    min_pressure_loss: MWD_MIN_PRESSURE_LOSS,
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};

  if (component.has_gamma_sensor && !Number.isFinite(component.gamma_sensor_to_bit_distance)) {
    error.gamma_sensor_to_bit_distance = 'This field is required.';
  }

  if (component.has_survey_sensor && !Number.isFinite(component.bit_to_survey_distance)) {
    error.bit_to_survey_distance = 'This field is required.';
  } else if (component.has_survey_sensor && component.bit_to_survey_distance <= 0) {
    error.bit_to_survey_distance = 'Should be a positive number.';
  } else if (component.has_survey_sensor && component.bit_to_survey_distance > 150) {
    error.bit_to_survey_distance = 'Should be less then 150.';
  }

  if (
    component.has_directional_sensor &&
    !Number.isFinite(component.directional_sensor_to_bit_distance)
  ) {
    error.directional_sensor_to_bit_distance = 'This field is required.';
  } else if (
    component.has_directional_sensor &&
    component.directional_sensor_to_bit_distance <= 0
  ) {
    error.directional_sensor_to_bit_distance = 'Should be a positive number.';
  } else if (
    component.has_directional_sensor &&
    component.directional_sensor_to_bit_distance > 150
  ) {
    error.directional_sensor_to_bit_distance = 'Should be less then 150.';
  }

  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentAgitator(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'agitator') return FAMILY_ERROR;

  const baseParams = {
    min_od: convertValue(AGITATOR_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(AGITATOR_MAX_OD, 'shortLength', 'in'),
    min_id: convertValue(AGITATOR_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(AGITATOR_MAX_ID, 'shortLength', 'in'),
    min_length: convertValue(AGITATOR_MIN_LENGTH, 'length', 'ft'),
    min_pressure_loss: AGITATOR_MIN_PRESSURE_LOSS,
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentRss(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'rss') return FAMILY_ERROR;

  const baseParams = {
    min_od: convertValue(RSS_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(RSS_MAX_OD, 'shortLength', 'in'),
    min_id: convertValue(RSS_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(RSS_MAX_ID, 'shortLength', 'in'),
    min_length: convertValue(RSS_MIN_LENGTH, 'length', 'ft'),
    min_pressure_loss: RSS_MIN_PRESSURE_LOSS,
  };
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  if (!isValidNumber(component.flow_loss_percentage, RSS_MIN_FLOW_LOSS, RSS_MAX_FLOW_LOSS)) {
    error.flow_loss_percentage = `It must be ${RSS_MIN_FLOW_LOSS}~${RSS_MAX_FLOW_LOSS}`;
  }
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentCt(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'ct') return FAMILY_ERROR;
  const shortLengthUnitDisplay = getUnitDisplay('shortLength');

  const baseParams = {
    min_id: convertValue(CT_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(CT_MAX_ID, 'shortLength', 'in'),
    min_od: convertValue(CT_MIN_OD, 'shortLength', 'in'),
    max_od: convertValue(CT_MAX_OD, 'shortLength', 'in'),
    min_length: convertValue(CT_MIN_LENGTH, 'length', 'ft'),
  };
  const minRd = convertValue(CT_MIN_RD, 'shortLength', 'in');
  const maxRd = convertValue(CT_MAX_RD, 'shortLength', 'in');
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  if (!error.inner_diameter && !error.outer_diameter && !error.linear_weight) {
    if (
      !isValidLinearWeight(
        component.inner_diameter,
        component.outer_diameter,
        component.linear_weight
      )
    ) {
      error.linear_weight = 'Invalid range';
    }
  }
  if (!isValidNumber(component.reel_diameter, minRd, maxRd)) {
    error.reel_diameter = `${minRd.toFixed(1)}~${maxRd.toFixed(1)} (${shortLengthUnitDisplay})`;
  }
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponentUr(component, bitSize = null) {
  if (!component) return NULL_ERROR;
  if (component.family !== 'ur') return FAMILY_ERROR;
  const shortLengthUnitDisplay = getUnitDisplay('shortLength');

  const baseParams = {
    min_id: convertValue(UR_MIN_ID, 'shortLength', 'in'),
    max_id: convertValue(UR_MAX_ID, 'shortLength', 'in'),
    min_od: convertValue(UR_MIN_BODY_OD, 'shortLength', 'in'),
    max_od: convertValue(UR_MAX_BODY_OD, 'shortLength', 'in'),
  };
  const minOpenedOd = convertValue(UR_MIN_OPENED_OD, 'shortLength', 'in');
  const maxOpenedOd = convertValue(UR_MAX_OPENED_OD, 'shortLength', 'in');
  const commonErrors = validateCommon(component, baseParams, bitSize);
  const error = commonErrors || {};
  if (!error.inner_diameter && !error.outer_diameter && !error.linear_weight) {
    if (
      !isValidLinearWeight(
        component.inner_diameter,
        component.outer_diameter,
        component.linear_weight
      )
    ) {
      error.linear_weight = 'Invalid range';
    }
  }
  if (!isValidNumber(component.ur_opened_od, minOpenedOd, maxOpenedOd)) {
    error.ur_opened_od = `${minOpenedOd.toFixed(1)}~${maxOpenedOd.toFixed(
      1
    )} (${shortLengthUnitDisplay})`;
  } else if (component.ur_opened_od < bitSize) {
    error.ur_opened_od = 'Max O.D (Opened) >= Bit Size';
  }

  if (!Number.isFinite(component.flow_rate)) {
    error.flow_rate = 'This field is required.';
  }

  if (
    component.activation_logic === 'depth_activation' &&
    !Number.isFinite(component.ur_opened_depth)
  ) {
    error.ur_opened_depth = 'This field is required.';
  }
  
  if (!component.activation_logic) {
    error.activation_logic = 'This field is required.';
  }

  const ratio = ctop(1, 'shortLength', 'in');
  const lowerLimit = BIT_MIN_TFA * (ratio * ratio);
  const upperLimit = BIT_MAX_TFA * (ratio * ratio);
  if (!isValidNumber(component.tfa, lowerLimit, upperLimit)) {
    error.tfa = `TFA must be ${lowerLimit.toFixed(2)}~${BIT_MAX_TFA.toFixed(2)}`;
  }
  const errors = {
    general: {},
    components: {
      [component.id]: error,
    },
    specificErrors: {},
  };

  return isEmpty(error) ? null : errors;
}

export function validateComponent(component, bitSize = null, maxOd = null) {
  if (!component) return NULL_ERROR;

  switch (component.family) {
    case 'dp':
      return validateComponentDp(component, bitSize);
    case 'hwdp':
      return validateComponentHwdp(component, bitSize);
    case 'dc':
      return validateComponentDc(component, bitSize);
    case 'jar':
      return validateComponentJar(component, bitSize);
    case 'sub':
      return validateComponentSub(component, bitSize);
    case 'bit':
      return validateComponentBit(component, maxOd);
    case 'pdm':
      return validateComponentPdm(component, bitSize);
    case 'lwd':
      return validateComponentLwd(component, bitSize);
    case 'stabilizer':
      return validateComponentStabilizer(component, bitSize);
    case 'mwd':
      return validateComponentMwd(component, bitSize);
    case 'agitator':
      return validateComponentAgitator(component, bitSize);
    case 'rss':
      return validateComponentRss(component, bitSize);
    case 'ct':
      return validateComponentCt(component, bitSize);
    case 'ur':
      return validateComponentUr(component, bitSize);
    default:
      return validateComponentDefaullt(component, bitSize);
  }
}

export function validateComponents(components, component = null) {
  if (!components) return NULL_ERROR;
  const bitComponents = components.filter(comp => comp.family === 'bit');
  const bitSize = bitComponents && (bitComponents.length > 0 ? bitComponents[0].size : null);
  const maxOd = maxBy(components, 'outer_diameter')?.outer_diameter;
  const mwdHavingGamma = components.filter(comp => comp.family === 'mwd' && comp.has_gamma_sensor);
  let hasFormErrors = false;
  let errors = {
    general: {},
    components: {},
    specificErrors: {},
  };
  for (let i = 0; i < components.length; i += 1) {
    const comp = components[i];
    if(!component || comp === component) {
      const error = component ? validateComponent(comp, bitSize, maxOd) :
        validateComponent(comp, bitSize);
      if (error) {
        hasFormErrors = true;
        errors = {
          ...errors,
          ...omit(error, ['general', 'components']),
          general: { ...errors.general, ...error.general },
          components: { ...errors.components, ...error.components },
        };
      }
      if (comp.family === 'mwd' && mwdHavingGamma.length > 1) {
        errors.components[
          comp.id
        ].gamma_sensor_to_bit_distance = `Only 1 gamma sensor allowed. Currently ${mwdHavingGamma.length}`;
        hasFormErrors = true;
      }
    }
  }
  if (!bitComponents || bitComponents.length !== 1) {
    errors.general.bit_count = 'Number of "BIT" components is invalid.';
    hasFormErrors = true;
  } else if (components[components.length - 1].family !== 'bit' && components[0].family !== 'bit') {
    // bit should be top or bottom
    errors.general.bit_position = '"BIT" category should be on the bottom of the list.';
    hasFormErrors = true;
  }

  if (hasFormErrors) {
    return errors;
  }
  return null;
}

export function validate(recordData) {
  if (!recordData) return NULL_ERROR;

  const {
    data: { id, start_timestamp_str, start_depth, components },
  } = recordData;
  if (!components) return NULL_ERROR;
  let errors = validateHeader({ id, start_timestamp_str, start_depth });
  const componentsErrors = validateComponents(components);

  if (componentsErrors) {
    errors = { ...errors, ...componentsErrors };
  }

  return errors;
}
