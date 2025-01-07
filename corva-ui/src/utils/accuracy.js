import { COLOR } from '~/constants/accuracy';

export function getSeverity(distanceToPlan, severeThreshold, moderateThreshold) {
  if (distanceToPlan >= severeThreshold) {
    return 'high';
  } else if (distanceToPlan >= moderateThreshold) {
    return 'moderate';
  }
  return 'low';
}

export function purifyPlanName(planName) {
  const textSignalsPlanNameIsUpdated = ', Updated Target';
  const indexOfTargetInName = planName.indexOf(textSignalsPlanNameIsUpdated);

  return indexOfTargetInName !== -1 ? planName.slice(0, indexOfTargetInName) : planName;
}

export function getColorBySeverity(accuracyData, severeThreshold, moderateThreshold, isLightTheme) {
  let severity;

  if (accuracyData) {
    // NOTE: If these props are passed, we calculate severity using them
    if (severeThreshold && moderateThreshold) {
      const distanceToPlan = accuracyData.distance_to_plan;
      severity = getSeverity(distanceToPlan, severeThreshold, moderateThreshold);
      // NOTE: No props were passed, so we use legacy way to get severity
    } else {
      severity = accuracyData.severity;
    }
  }

  switch (severity) {
    case 'low':
      return COLOR.green;
    case 'moderate':
      return isLightTheme ? COLOR.orange : COLOR.yellow;
    case 'high':
      return COLOR.red;
    // NOTE: Unknown type of severity is white
    default:
      return COLOR.white;
  }
}
