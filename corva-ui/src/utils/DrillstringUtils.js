/************ deprecated DO NOT USE IT ************************/
/************ new version in drillstring folder */
/* eslint-disable camelcase */
import set from 'lodash/set';
import get from 'lodash/get';
import moment from 'moment';

import { getUnitPreference, convertValue, getUnitDisplay } from './convert';

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

export function sValueEmpty(val) {
  return val === null || typeof val === 'undefined' || val === '';
}

export function isValidNumber(num, min, max, { isMinInclusive = true } = {}) {
  const parsedNum = parseFloat(num);
  if (Number.isNaN(parsedNum)) {
    return false;
  }
  if ((isMinInclusive && parsedNum < min) || (!isMinInclusive && parsedNum <= min)) {
    return false;
  }

  if (max && parsedNum > max) {
    return false;
  }

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

export function validate(recordData) {
  const {
    data: { id, start_timestamp_str, start_depth, components },
  } = recordData.toJS();
  const shortLengthUnitDisplay = getUnitDisplay('shortLength');
  const lengthUnitDisplay = getUnitDisplay('length');
  const errors = {
    general: {},
    components: {},
    specificErrors: {},
  };
  const bitComponents = components.filter(comp => comp.family === 'bit');
  const bitSize = bitComponents.length > 0 ? bitComponents[0].size : null;
  const mwdHavingGamma = components.filter(comp => comp.family === 'mwd' && comp.has_gamma_sensor);
  let hasFormErrors = false;

  if (isValueEmpty(id)) {
    errors.id = 'It should not be empty.';
    hasFormErrors = true;
  }

  if (start_timestamp_str && !moment(new Date(start_timestamp_str)).isValid()) {
    hasFormErrors = true;
    errors.start_timestamp = 'Invalid Date.';
  }

  if (Number.isFinite(start_depth)) {
    const minDepth = convertValue(DEPTH_IN_HOLE_MIN, 'length', 'ft');
    const maxDepth = convertValue(DEPTH_IN_HOLE_MAX, 'length', 'ft');
    const prohibitedDepth = convertValue(DEPTH_IN_HOLE_PROHIBITED, 'length', 'ft');
    if (start_depth <= minDepth || start_depth > maxDepth) {
      hasFormErrors = true;
      errors.start_depth = `Should be a positive number ${minDepth.toFixed(2)}~${maxDepth.toFixed(
        2
      )} (${lengthUnitDisplay})`;
    }
    if (start_depth === prohibitedDepth) {
      hasFormErrors = true;
      errors.start_depth = `Should not be equal to ${prohibitedDepth} (${lengthUnitDisplay})`;
    }
  } else {
    hasFormErrors = true;
    errors.start_depth = 'It should not be empty.';
  }

  for (let i = 0; i < components.length; i += 1) {
    let min_id;
    let min_od;
    let max_id;
    let max_od;
    let min_opened_od;
    let max_opened_od;
    let min_length;
    let min_tj_id;
    let max_tj_id;
    let min_tj_od;
    let max_tj_od;
    let min_pressure_loss;
    let min_off_bottom_pressure_loss;
    let min_rd;
    let max_rd;

    const comp = components[i];
    const error = {};
    switch (comp.family) {
      case 'ct':
        min_id = convertValue(CT_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(CT_MAX_ID, 'shortLength', 'in');
        min_od = convertValue(CT_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(CT_MAX_OD, 'shortLength', 'in');
        min_rd = convertValue(CT_MIN_RD, 'shortLength', 'in');
        max_rd = convertValue(CT_MAX_RD, 'shortLength', 'in');
        min_length = convertValue(CT_MIN_LENGTH, 'length', 'ft');
        break;

      case 'dp':
        min_id = convertValue(DP_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(DP_MAX_ID, 'shortLength', 'in');
        min_od = convertValue(DP_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(DP_MAX_OD, 'shortLength', 'in');
        min_tj_id = convertValue(DP_MIN_TJ_ID, 'shortLength', 'in');
        max_tj_id = convertValue(DP_MAX_TJ_ID, 'shortLength', 'in');
        min_tj_od = convertValue(DP_MIN_TJ_OD, 'shortLength', 'in');
        max_tj_od = convertValue(DP_MAX_TJ_OD, 'shortLength', 'in');
        min_length = convertValue(DP_MIN_LENGTH, 'length', 'ft');
        break;

      case 'hwdp':
        min_id = convertValue(HWDP_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(HWDP_MAX_ID, 'shortLength', 'in');
        min_od = convertValue(HWDP_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(HWDP_MAX_OD, 'shortLength', 'in');
        min_tj_id = convertValue(HWDP_MIN_TJ_ID, 'shortLength', 'in');
        max_tj_id = convertValue(HWDP_MAX_TJ_ID, 'shortLength', 'in');
        min_tj_od = convertValue(HWDP_MIN_TJ_OD, 'shortLength', 'in');
        max_tj_od = convertValue(HWDP_MAX_TJ_OD, 'shortLength', 'in');
        min_length = convertValue(HWDP_MIN_LENGTH, 'length', 'ft');
        break;

      case 'dc':
        min_id = convertValue(DC_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(DC_MAX_ID, 'shortLength', 'in');
        min_od = convertValue(DC_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(DC_MAX_OD, 'shortLength', 'in');
        min_length = convertValue(DC_MIN_LENGTH, 'length', 'ft');
        break;

      case 'stabilizer':
        min_id = convertValue(STABLE_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(STABLE_MAX_ID, 'shortLength', 'in');
        min_od = convertValue(STABLE_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(STABLE_MAX_OD, 'shortLength', 'in');
        min_length = convertValue(STABLE_MIN_LENGTH, 'length', 'ft');
        break;

      case 'pdm':
        min_od = convertValue(PDM_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(PDM_MAX_OD, 'shortLength', 'in');
        min_id = convertValue(PDM_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(PDM_MAX_ID, 'shortLength', 'in');
        min_length = convertValue(PDM_MIN_LENGTH, 'length', 'ft');
        min_off_bottom_pressure_loss = PDM_MIN_OFF_BOTTOM_PRESSURE_LOSS;
        break;

      case 'mwd':
        min_od = convertValue(MWD_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(MWD_MAX_OD, 'shortLength', 'in');
        min_id = convertValue(MWD_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(MWD_MAX_ID, 'shortLength', 'in');
        min_length = convertValue(MWD_MIN_LENGTH, 'length', 'ft');
        min_pressure_loss = MWD_MIN_PRESSURE_LOSS;
        break;

      case 'agitator':
        min_od = convertValue(AGITATOR_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(AGITATOR_MAX_OD, 'shortLength', 'in');
        min_id = convertValue(AGITATOR_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(AGITATOR_MAX_ID, 'shortLength', 'in');
        min_length = convertValue(AGITATOR_MIN_LENGTH, 'length', 'ft');
        min_pressure_loss = AGITATOR_MIN_PRESSURE_LOSS;
        break;

      case 'rss':
        min_od = convertValue(RSS_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(RSS_MAX_OD, 'shortLength', 'in');
        min_id = convertValue(RSS_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(RSS_MAX_ID, 'shortLength', 'in');
        min_length = convertValue(RSS_MIN_LENGTH, 'length', 'ft');
        min_pressure_loss = RSS_MIN_PRESSURE_LOSS;
        break;

      case 'ur':
        min_id = convertValue(UR_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(UR_MAX_ID, 'shortLength', 'in');
        min_od = convertValue(UR_MIN_BODY_OD, 'shortLength', 'in');
        max_od = convertValue(UR_MAX_BODY_OD, 'shortLength', 'in');
        min_opened_od = convertValue(UR_MIN_OPENED_OD, 'shortLength', 'in');
        max_opened_od = convertValue(UR_MAX_OPENED_OD, 'shortLength', 'in');
        break;

      case 'bit':
        break;

      default:
        min_id = convertValue(DEF_MIN_ID, 'shortLength', 'in');
        max_id = convertValue(DEF_MAX_ID, 'shortLength', 'in');
        min_od = convertValue(DEF_MIN_OD, 'shortLength', 'in');
        max_od = convertValue(DEF_MAX_OD, 'shortLength', 'in');
        min_length = convertValue(DEF_MIN_LENGTH, 'length', 'ft');
        break;
    }

    if (!isValueEmpty(min_id) && !isValueEmpty(min_od)) {
      if (!isValidNumber(comp.inner_diameter, min_id, max_id)) {
        error.inner_diameter = `${min_id.toFixed(1)}~${max_id.toFixed(
          1
        )} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }

      if (!isValidNumber(comp.outer_diameter, min_od, max_od)) {
        error.outer_diameter = `${min_od.toFixed(1)}~${max_od.toFixed(
          1
        )} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }

      if (
        isValidNumber(comp.inner_diameter, min_id, max_id) &&
        isValidNumber(comp.outer_diameter, min_od, max_od) &&
        !isValidNumber(comp.inner_diameter, min_id, comp.outer_diameter)
      ) {
        error.outer_diameter = 'O.D > I.D';
        hasFormErrors = true;
      }

      if (!error.outer_diameter && bitSize) {
        if (
          +comp.outer_diameter + convertValue(ALLOWED_DIFF_OD_BIT_SIZE, 'shortLength', 'in') >
          bitSize
        ) {
          error.outer_diameter = ' O.D + 0.1 < Bit Size';
          hasFormErrors = true;
        }
      }

      // only check validity of linear weight when family is not bit
      if (!isValidNumber(comp.linear_weight, 0)) {
        error.linear_weight = 'Invalid value';
        hasFormErrors = true;
      }

      if (
        comp.family === 'dp' ||
        comp.family === 'hwdp' ||
        comp.family === 'dc' ||
        comp.family === 'ct' ||
        comp.family === 'ur'
      ) {
        if (!error.inner_diameter && !error.outer_diameter && !error.linear_weight) {
          if (!isValidLinearWeight(comp.inner_diameter, comp.outer_diameter, comp.linear_weight)) {
            error.linear_weight = 'Invalid range';
            hasFormErrors = true;
          }
        }
      }
    }
    if (comp.family === 'ur') {
      if (!isValidNumber(comp.ur_opened_od, min_opened_od, max_opened_od)) {
        error.ur_opened_od = `${min_opened_od.toFixed(1)}~${max_opened_od.toFixed(
          1
        )} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      } else if (comp.ur_opened_od < bitSize) {
        error.ur_opened_od = 'Max O.D (Opened) >= Bit Size';
        hasFormErrors = true;
      }
    }

    if (!isValueEmpty(min_tj_id) && !isValueEmpty(min_tj_od)) {
      if (!isValidNumber(comp.inner_diameter_tooljoint, min_tj_id, max_tj_id)) {
        error.inner_diameter_tooljoint = `${min_tj_id.toFixed(1)}~${max_tj_id.toFixed(
          1
        )} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }

      if (!isValidNumber(comp.outer_diameter_tooljoint, min_tj_od, max_tj_od)) {
        error.outer_diameter_tooljoint = `${min_tj_od.toFixed(1)}~${max_tj_od.toFixed(
          1
        )} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }

      if (!isValidNumber(comp.outer_diameter_tooljoint, comp.outer_diameter, max_tj_od)) {
        error.outer_diameter_tooljoint = 'Tool Joint O.D >= O.D';
        hasFormErrors = true;
      }
    }

    if (!isValueEmpty(min_length)) {
      if (!isValidNumber(comp.length, min_length)) {
        error.length = 'Invalid value';
        hasFormErrors = true;
      }
    }

    if (!isValueEmpty(comp.length_tooljoint) && !isValueEmpty(comp.component_length)) {
      if (+comp.length_tooljoint > +comp.component_length) {
        error.length_tooljoint = 'Tool Joint Length < Component Length';
        hasFormErrors = true;
      }
    }

    if (comp.off_bottom_pressure_loss && comp.off_bottom_pressure_loss.length > 0) {
      error.off_bottom_pressure_loss = {};
      for (let j = 0; j < comp.off_bottom_pressure_loss.length; j += 1) {
        const obpsItem = comp.off_bottom_pressure_loss[j];
        error.off_bottom_pressure_loss[j] = {};
        if (isValueEmpty(obpsItem.flow_rate)) {
          error.off_bottom_pressure_loss[j].flow_rate = 'flow rate is required.';
          hasFormErrors = true;
        }
        if (isValueEmpty(obpsItem.pressure_loss)) {
          error.off_bottom_pressure_loss[j].pressure_loss = 'pressure loss is required.';
          hasFormErrors = true;
        }
        if (
          !isValueEmpty(min_off_bottom_pressure_loss) &&
          !isValidNumber(obpsItem.pressure_loss, min_off_bottom_pressure_loss, null, {
            isMinInclusive: false,
          })
        ) {
          error.off_bottom_pressure_loss[j].pressure_loss = 'Invalid range';
          hasFormErrors = true;
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
          hasFormErrors = true;
        }
        if (isValueEmpty(pressureLossItem.pressure_loss)) {
          error.pressure_loss[j].pressure_loss = 'pressure loss is required.';
          hasFormErrors = true;
        }
        if (
          !isValueEmpty(min_pressure_loss) &&
          !isValidNumber(pressureLossItem.pressure_loss, min_pressure_loss, null, {
            isMinInclusive: false,
          })
        ) {
          error.pressure_loss[j].pressure_loss = 'Invalid range';
          hasFormErrors = true;
        }
      }
    }

    if (comp.has_stabilizer && comp.stabilizer) {
      const stab_min_id = convertValue(STABLE_MIN_ID, 'shortLength', 'in');
      const stab_max_id = convertValue(STABLE_MAX_ID, 'shortLength', 'in');
      const stab_min_od = convertValue(STABLE_MIN_OD, 'shortLength', 'in');
      const stab_max_od = convertValue(STABLE_MAX_OD, 'shortLength', 'in');
      const stab_min_length = convertValue(STABLE_MIN_LENGTH, 'length', 'ft');

      if (
        isValidNumber(comp.stabilizer.inner_diameter, stab_min_id, stab_max_id) &&
        isValidNumber(comp.stabilizer.outer_diameter, stab_min_od, stab_max_od) &&
        !isValidNumber(comp.stabilizer.inner_diameter, min_id, comp.stabilizer.outer_diameter)
      ) {
        error.stabilizer_outer_diameter = 'O.D > I.D';
        hasFormErrors = true;
      }

      if (!isValidNumber(comp.stabilizer.inner_diameter, stab_min_id, stab_max_id)) {
        error.stabilizer_inner_diameter = `${stab_min_id.toFixed(1)}~${stab_max_id.toFixed(
          1
        )} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }
      if (!isValidNumber(comp.stabilizer.outer_diameter, stab_min_od, stab_max_od)) {
        error.stabilizer_outer_diameter = `${stab_min_od.toFixed(1)}~${stab_max_od.toFixed(
          1
        )} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }
      if (!isValueEmpty(stab_min_length)) {
        if (!isValidNumber(comp.stabilizer.length, stab_min_length)) {
          error.stabilizer_length = 'Invalid value';
          hasFormErrors = true;
        }
      }
      if (isValueEmpty(comp.stabilizer.linear_weight)) {
        error.stabilizer_linear_weight = 'Invalid value';
        hasFormErrors = true;
      }
      if (!error.stabilizer_outer_diameter && bitSize) {
        if (
          +comp.stabilizer.outer_diameter +
            convertValue(ALLOWED_DIFF_OD_BIT_SIZE, 'shortLength', 'in') >
          bitSize
        ) {
          error.stabilizer_outer_diameter = ' O.D + 0.1 < Bit Size';
          hasFormErrors = true;
        }
      }
    }

    // specificErrors
    if (comp.family === 'ct') {
      if (!isValidNumber(comp.reel_diameter, min_rd, max_rd)) {
        error.reel_diameter = `${min_rd.toFixed(1)}~${max_rd.toFixed(
          1
        )} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }
    }

    if (comp.family === 'bit') {
      const ratio = ctop(1, 'shortLength', 'in');
      const lowerLimit = BIT_MIN_TFA * (ratio * ratio);
      const upperLimit = BIT_MAX_TFA * (ratio * ratio);
      if (!isValidNumber(comp.tfa, lowerLimit, upperLimit)) {
        error.tfa = `TFA must be ${lowerLimit.toFixed(2)}~${BIT_MAX_TFA.toFixed(2)}`;
        hasFormErrors = true;
      }
    }

    if (comp.family === 'rss') {
      if (!isValidNumber(comp.flow_loss_percentage, RSS_MIN_FLOW_LOSS, RSS_MAX_FLOW_LOSS)) {
        error.flow_loss_percentage = `It must be ${RSS_MIN_FLOW_LOSS}~${RSS_MAX_FLOW_LOSS}`;
        hasFormErrors = true;
      }
    }

    if (comp.family === 'mwd') {
      if (mwdHavingGamma.length > 1) {
        error.gamma_sensor_to_bit_distance = `Only 1 gamma sensor allowed. Currently ${mwdHavingGamma.length}`;
        hasFormErrors = true;
      } else if (comp.has_gamma_sensor && !Number.isFinite(comp.gamma_sensor_to_bit_distance)) {
        error.gamma_sensor_to_bit_distance = 'This field is required.';
        hasFormErrors = true;
      }

      if (comp.has_survey_sensor && !Number.isFinite(comp.bit_to_survey_distance)) {
        error.bit_to_survey_distance = 'This field is required.';
        hasFormErrors = true;
      } else if (comp.has_survey_sensor && comp.bit_to_survey_distance <= 0) {
        error.bit_to_survey_distance = 'Should be a positive number.';
        hasFormErrors = true;
      } else if (comp.has_survey_sensor && comp.bit_to_survey_distance > 150) {
        error.bit_to_survey_distance = 'Should be less then 150.';
        hasFormErrors = true;
      }

      if (
        comp.has_directional_sensor &&
        !Number.isFinite(comp.directional_sensor_to_bit_distance)
      ) {
        error.directional_sensor_to_bit_distance = 'This field is required.';
        hasFormErrors = true;
      } else if (comp.has_directional_sensor && comp.directional_sensor_to_bit_distance <= 0) {
        error.directional_sensor_to_bit_distance = 'Should be a positive number.';
        hasFormErrors = true;
      } else if (comp.has_directional_sensor && comp.directional_sensor_to_bit_distance > 150) {
        error.directional_sensor_to_bit_distance = 'Should be less then 150.';
        hasFormErrors = true;
      }
    }

    if (comp.family === 'pdm') {
      let pdmFieldUnitLower;
      let pdmFieldUnitUpper;

      if (!isValidNumber(comp.number_rotor_lobes, PDM_MIN_ROTOR, PDM_MAX_ROTOR)) {
        error.number_rotor_lobes = `It must be ${PDM_MIN_ROTOR}~${PDM_MAX_ROTOR}`;
        hasFormErrors = true;
      }

      if (!isValidNumber(comp.number_stator_lobes, PDM_MIN_STATOR, PDM_MAX_STATOR)) {
        error.number_stator_lobes = `It must be ${PDM_MIN_STATOR}~${PDM_MAX_STATOR}`;
        hasFormErrors = true;
      }

      if (!isValidNumber(comp.rpg, PDM_MIN_RPG, PDM_MAX_RPG)) {
        error.rpg = `It must be ${PDM_MIN_RPG}~${PDM_MAX_RPG}`;
        hasFormErrors = true;
      }

      pdmFieldUnitLower = convertValue(PDM_MIN_WOB, 'force', 'klbf');
      pdmFieldUnitUpper = convertValue(PDM_MAX_WOB, 'force', 'klbf');
      if (
        !isValueEmpty(comp.max_weight_on_bit) &&
        !isValidNumber(comp.max_weight_on_bit, pdmFieldUnitLower, pdmFieldUnitUpper)
      ) {
        error.max_weight_on_bit = `It must be ${pdmFieldUnitUpper.toFixed(
          2
        )}~${pdmFieldUnitUpper.toFixed(2)}`;
        hasFormErrors = true;
      }

      pdmFieldUnitLower = convertValue(PDM_MIN_FLOW_RANGE, 'volumeFlowRate', 'gal/min');
      pdmFieldUnitUpper = convertValue(PDM_MAX_FLOW_RANGE, 'volumeFlowRate', 'gal/min');
      if (!isValidNumber(comp.min_standard_flowrate, pdmFieldUnitLower, pdmFieldUnitUpper)) {
        error.min_standard_flowrate = `It must be ${pdmFieldUnitLower.toFixed(
          2
        )}~${pdmFieldUnitUpper.toFixed(2)}`;
        hasFormErrors = true;
      }

      if (!isValidNumber(comp.max_standard_flowrate, pdmFieldUnitLower, pdmFieldUnitUpper)) {
        error.max_standard_flowrate = `It must be ${pdmFieldUnitLower.toFixed(
          2
        )}~${pdmFieldUnitUpper.toFixed(2)}`;
        hasFormErrors = true;
      }

      pdmFieldUnitLower = convertValue(PDM_MIN_MODP, 'pressure', 'psi');
      pdmFieldUnitUpper = convertValue(PDM_MAX_MODP, 'pressure', 'psi');
      if (
        !isValidNumber(
          comp.max_operating_differential_pressure,
          pdmFieldUnitLower,
          pdmFieldUnitUpper
        )
      ) {
        error.max_operating_differential_pressure = `It must be ${pdmFieldUnitLower.toFixed(
          2
        )}~${pdmFieldUnitUpper.toFixed(2)}`;
        hasFormErrors = true;
      }

      pdmFieldUnitLower = convertValue(PDM_MIN_TMODP, 'torque', 'ft-klbf');
      pdmFieldUnitUpper = convertValue(PDM_MAX_TMODP, 'torque', 'ft-klbf');
      if (
        !isValidNumber(
          comp.torque_at_max_operating_differential_pressure,
          pdmFieldUnitLower,
          pdmFieldUnitUpper
        )
      ) {
        error.torque_at_max_operating_differential_pressure = `It must be ${pdmFieldUnitLower.toFixed(
          2
        )}~${pdmFieldUnitUpper.toFixed(2)}`;
        hasFormErrors = true;
      }

      if (!isValidNumber(comp.flow_loss_percentage, PDM_MIN_FLOW_LOSS, PDM_MAX_FLOW_LOSS)) {
        error.flow_loss_percentage = `It must be ${PDM_MIN_FLOW_LOSS}~${PDM_MAX_FLOW_LOSS}`;
        hasFormErrors = true;
      }
    }

    errors.components[comp.id] = error;
  }

  if (bitComponents.length !== 1) {
    errors.general.bit_count = 'Number of "BIT" components is invalid.';
    hasFormErrors = true;
  }

  if (
    bitComponents.length === 1 &&
    components[components.length - 1].family !== 'bit' &&
    components[0].family !== 'bit'
  ) {
    // bit should be top or bottom
    errors.general.bit_position = '"BIT" category should be on the bottom of the list.';
    hasFormErrors = true;
  }

  if (hasFormErrors) {
    return errors;
  }
  return null;
}

export function convertRecordBackToImperialUnit(record) {
  // if bit is top, reverse the components;
  let components = get(record, ['data', 'components']);
  if (get(components, [0, 'family']) === 'bit') {
    components = components.reverse().map((comp, idx) => ({ ...comp, order: idx }));
    record = set(record, ['data', 'components'], components); // eslint-disable-line no-param-reassign
  }

  const { data } = record.toJS();
  const objStartTime = data.start_timestamp_str && moment(new Date(data.start_timestamp_str));
  if (objStartTime && objStartTime.isValid()) {
    data.start_timestamp = objStartTime.unix();
  }
  delete data.start_timestamp_str;

  data.start_depth = ctoi(data.start_depth, 'length', 'ft');
  data.components = data.components.map(component => {
    const cc = Object.assign({}, component);
    cc.inner_diameter = ctoi(cc.inner_diameter, 'shortLength', 'in');
    cc.outer_diameter = ctoi(cc.outer_diameter, 'shortLength', 'in', 4);
    cc.linear_weight = ctoi(cc.linear_weight, 'massPerLength', 'lb-ft');
    cc.weight = ctoi(cc.weight, 'mass', 'lb');
    cc.length = ctoi(cc.length, 'length', 'ft');
    cc.component_length = ctoi(cc.component_length, 'length', 'ft');
    cc.outer_diameter_tooljoint = ctoi(cc.outer_diameter_tooljoint, 'shortLength', 'in');
    cc.inner_diameter_tooljoint = ctoi(cc.inner_diameter_tooljoint, 'shortLength', 'in');
    cc.length_tooljoint = ctoi(cc.length_tooljoint, 'length', 'ft');

    if (cc.family === 'bit' || cc.family === 'ur') {
      const ratio = ctoi(1, 'shortLength', 'in');
      cc.size = ctoi(cc.size, 'shortLength', 'in', 3);
      if (cc.nozzle_sizes && cc.nozzle_sizes.length > 0) {
        for (let j = 0; j < cc.nozzle_sizes.length; j += 1) {
          const item = cc.nozzle_sizes[j];
          item.size = ratio !== 1 ? ctoi(item.size, 'shortLength', 'in') * 32 : item.size;
        }
      }
      cc.tfa = ratio !== 1 ? cc.tfa * (ratio * ratio) : cc.tfa;
    }

    if (cc.family === 'pdm') {
      cc.max_weight_on_bit = ctoi(cc.max_weight_on_bit, 'force', 'klbf');
      cc.min_standard_flowrate = ctoi(cc.min_standard_flowrate, 'volumeFlowRate', 'gal/min');
      cc.max_standard_flowrate = ctoi(cc.max_standard_flowrate, 'volumeFlowRate', 'gal/min');
      cc.max_operating_differential_pressure = ctoi(
        cc.max_operating_differential_pressure,
        'pressure',
        'psi'
      );
      cc.torque_at_max_operating_differential_pressure = ctoi(
        cc.torque_at_max_operating_differential_pressure,
        'torque',
        'ft-klbf',
        3
      );
      cc.rpg = ctoi(cc.rpg, 'revolutionPerVolume', 'rpg');

      if (cc.off_bottom_pressure_loss && cc.off_bottom_pressure_loss.length > 0) {
        for (let j = 0; j < cc.off_bottom_pressure_loss.length; j += 1) {
          const item = cc.off_bottom_pressure_loss[j];
          item.flow_rate = ctoi(item.flow_rate, 'volumeFlowRate', 'gal/min');
          item.pressure_loss = ctoi(item.pressure_loss, 'pressure', 'psi');
        }
      }
      if (!cc.has_stabilizer) {
        delete cc.stabilizer;
      }
      if (cc.stabilizer) {
        cc.stabilizer.inner_diameter =
          cc.stabilizer.inner_diameter && ctoi(cc.stabilizer.inner_diameter, 'shortLength', 'in');
        cc.stabilizer.outer_diameter =
          cc.stabilizer.outer_diameter && ctoi(cc.stabilizer.outer_diameter, 'shortLength', 'in');
        cc.stabilizer.linear_weight =
          cc.stabilizer.linear_weight &&
          ctoi(cc.stabilizer.linear_weight, 'massPerLength', 'lb-ft');
        cc.stabilizer.weight = cc.stabilizer.weight && ctoi(cc.stabilizer.weight, 'mass', 'lb');
        cc.stabilizer.length = cc.length && ctoi(cc.stabilizer.length, 'length', 'ft');
        cc.stabilizer.gauge_od =
          cc.stabilizer.gauge_od && ctoi(cc.stabilizer.gauge_od, 'shortLength', 'in');
        cc.stabilizer.gauge_length =
          cc.stabilizer.gauge_length && ctoi(cc.stabilizer.gauge_length, 'shortLength', 'in');
        cc.stabilizer.blade_width =
          cc.stabilizer.blade_width && ctoi(cc.stabilizer.blade_width, 'shortLength', 'in');
        cc.stabilizer.stab_centerpoint_to_bit =
          cc.stabilizer.stab_centerpoint_to_bit &&
          ctoi(cc.stabilizer.stab_centerpoint_to_bit, 'length', 'ft');
      }
    }

    if (cc.family === 'stabilizer') {
      cc.gauge_od = ctoi(cc.gauge_od, 'shortLength', 'in');
      cc.gauge_length = ctoi(cc.gauge_length, 'shortLength', 'in');
      cc.blade_width = ctoi(cc.blade_width, 'shortLength', 'in');
    }

    if (cc.family === 'mwd' || cc.family === 'rss' || cc.family === 'agitator') {
      if (cc.pressure_loss && cc.pressure_loss.length > 0) {
        for (let j = 0; j < cc.pressure_loss.length; j += 1) {
          const item = cc.pressure_loss[j];
          item.flow_rate = ctoi(item.flow_rate, 'volumeFlowRate', 'gal/min');
          item.pressure_loss = ctoi(item.pressure_loss, 'pressure', 'psi');
        }
      }
    }

    if (cc.family !== 'bit') {
      delete cc.bit_type;
    }
    if (!cc.has_gamma_sensor && Number.isFinite(cc.gamma_sensor_to_bit_distance)) {
      delete cc.gamma_sensor_to_bit_distance;
    }
    if (!cc.has_survey_sensor && Number.isFinite(cc.bit_to_survey_distance)) {
      delete cc.bit_to_survey_distance;
    }
    if (!cc.has_directional_sensor && Number.isFinite(cc.directional_sensor_to_bit_distance)) {
      delete cc.directional_sensor_to_bit_distance;
    }
    delete cc.c_length;
    return cc;
  });

  return {
    ...record,
    data,
  };
}

export function ctoi(val, unitType, unit, precision = 2) {
  if (val === null || typeof val === 'undefined') {
    return null;
  }
  if (!unitType || !unit) {
    return parseFloat(val);
  }
  return parseFloat(convertValue(val, unitType, getUnitPreference(unitType), unit, precision));
}

export function convertRecordtoPrefUnit(record) {
  const { data } = record.toJS();
  const { components } = data;
  data.start_depth = ctop(data.start_depth, 'length', 'ft');

  if (components.length > 0) {
    if (components[0].family === 'bit') {
      components[0].c_length = components[0].length || 0;
      for (let i = 1; i < components.length; i += 1) {
        components[i].c_length =
          parseFloat(components[i - 1].c_length) + parseFloat(components[i].length || 0);
      }
    } else {
      const lastIndex = components.length - 1;
      components[lastIndex].c_length = components[lastIndex].length || 0;
      for (let i = lastIndex - 1; i >= 0; i -= 1) {
        components[i].c_length =
          parseFloat(components[i + 1].c_length) + parseFloat(components[i].length || 0);
      }
    }
  }

  for (let i = 0; i < components.length; i += 1) {
    const comp = components[i];
    comp.inner_diameter = ctop(comp.inner_diameter, 'shortLength', 'in');
    comp.outer_diameter = ctop(comp.outer_diameter, 'shortLength', 'in', 4);
    comp.linear_weight = ctop(comp.linear_weight, 'massPerLength', 'lb-ft');
    comp.weight = ctop(comp.weight, 'mass', 'lb');
    comp.length = ctop(comp.length, 'length', 'ft');
    comp.component_length = ctop(comp.component_length, 'length', 'ft');
    comp.outer_diameter_tooljoint = ctop(comp.outer_diameter_tooljoint, 'shortLength', 'in');
    comp.inner_diameter_tooljoint = ctop(comp.inner_diameter_tooljoint, 'shortLength', 'in');
    comp.length_tooljoint = ctop(comp.length_tooljoint, 'length', 'ft');

    comp.c_length = ctop(comp.c_length, 'length', 'ft');
    comp.gamma_sensor_to_bit_distance = ctop(comp.gamma_sensor_to_bit_distance, 'length', 'ft');

    if (comp.family === 'bit' || comp.family === 'ur') {
      const ratio = ctop(1, 'shortLength', 'in');
      comp.size = ctop(comp.size, 'shortLength', 'in');
      if (comp.nozzle_sizes && comp.nozzle_sizes.length > 0) {
        for (let j = 0; j < comp.nozzle_sizes.length; j += 1) {
          const item = comp.nozzle_sizes[j];
          item.size = ratio !== 1 ? ctop(item.size, 'shortLength', 'in') / 32 : item.size;
        }
      }
      comp.tfa = ratio !== 1 ? comp.tfa * (ratio * ratio) : comp.tfa;
    }

    if (comp.family === 'pdm') {
      comp.max_weight_on_bit = ctop(comp.max_weight_on_bit, 'force', 'klbf');
      comp.min_standard_flowrate = ctop(comp.min_standard_flowrate, 'volumeFlowRate', 'gal/min');
      comp.max_standard_flowrate = ctop(comp.max_standard_flowrate, 'volumeFlowRate', 'gal/min');
      comp.max_operating_differential_pressure = ctop(
        comp.max_operating_differential_pressure,
        'pressure',
        'psi'
      );
      comp.torque_at_max_operating_differential_pressure = ctop(
        comp.torque_at_max_operating_differential_pressure,
        'torque',
        'ft-klbf',
        3
      );
      if (comp.off_bottom_pressure_loss && comp.off_bottom_pressure_loss.length > 0) {
        for (let j = 0; j < comp.off_bottom_pressure_loss.length; j += 1) {
          const item = comp.off_bottom_pressure_loss[j];
          item.flow_rate = ctop(item.flow_rate, 'volumeFlowRate', 'gal/min');
          item.pressure_loss = ctop(item.pressure_loss, 'pressure', 'psi');
        }
      }
      comp.rpg = ctop(comp.rpg, 'revolutionPerVolume', 'rpg');
      if (comp.has_stabilizer && comp.stabilizer) {
        comp.stabilizer.inner_diameter = ctop(comp.stabilizer.inner_diameter, 'shortLength', 'in');
        comp.stabilizer.outer_diameter = ctop(comp.stabilizer.outer_diameter, 'shortLength', 'in');
        comp.stabilizer.linear_weight = ctop(
          comp.stabilizer.linear_weight,
          'massPerLength',
          'lb-ft'
        );
        comp.stabilizer.weight = ctop(comp.stabilizer.weight, 'mass', 'lb');
        comp.stabilizer.length = ctop(comp.stabilizer.length, 'length', 'ft');
        comp.stabilizer.gauge_od = ctop(comp.stabilizer.gauge_od, 'shortLength', 'in');
        comp.stabilizer.gauge_length = ctop(comp.stabilizer.gauge_length, 'shortLength', 'in');
        comp.stabilizer.blade_width = ctop(comp.stabilizer.blade_width, 'shortLength', 'in');
        comp.stabilizer.stab_centerpoint_to_bit = ctop(
          comp.stabilizer.stab_centerpoint_to_bit,
          'length',
          'ft'
        );
      }
    }

    if (comp.family === 'stabilizer') {
      comp.gauge_od = ctop(comp.gauge_od, 'shortLength', 'in');
      comp.gauge_length = ctop(comp.gauge_length, 'shortLength', 'in');
      comp.blade_width = ctop(comp.blade_width, 'shortLength', 'in');
    }

    if (comp.family === 'mwd' || comp.family === 'rss' || comp.family === 'agitator') {
      if (comp.pressure_loss && comp.pressure_loss.length > 0) {
        for (let j = 0; j < comp.pressure_loss.length; j += 1) {
          const item = comp.pressure_loss[j];
          item.flow_rate = ctop(item.flow_rate, 'volumeFlowRate', 'gal/min');
          item.pressure_loss = ctop(item.pressure_loss, 'pressure', 'psi');
        }
      }
    }
  }
  return {
    ...record,
    data,
  };
}

export function ctop(val, unitType, unit, precision = 2) {
  if (val !== 0 && !val) {
    return null;
  }
  return unitType && unit ? convertValue(val, unitType, unit, null, precision) : val;
}
