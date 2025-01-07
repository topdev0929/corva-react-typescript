import { get } from 'lodash';

import { GOAL_TYPES_DICT } from '~/constants/goals';
import { SEGMENTS } from '~/constants/segment';

export function getCompanyGoalSetting(companyGoals, goalName, segment = SEGMENTS.DRILLING) {
  return get(companyGoals, `${goalName}.${segment}.${GOAL_TYPES_DICT.company.key}`);
}

export function getProgramGoalSetting(
  companyGoals,
  goalName,
  programId,
  segment = SEGMENTS.DRILLING
) {
  return get(companyGoals, `${goalName}.${segment}.${GOAL_TYPES_DICT.program.key}.${programId}`);
}

// NOTE: Program goal has higher priority than company goal
export function getPriorityGoalSetting(
  companyGoals,
  goalName,
  programId,
  segment = SEGMENTS.DRILLING
) {
  const programGoal = getProgramGoalSetting(companyGoals, goalName, programId, segment);
  const companyGoal = getCompanyGoalSetting(companyGoals, goalName, segment);
  return Number.isFinite(programGoal) ? programGoal : companyGoal;
}
