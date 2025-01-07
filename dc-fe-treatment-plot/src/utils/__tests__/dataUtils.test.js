import { getGoalKey, isLight } from '../dataUtils';

describe('colors', () => {
  it('returns false for darker color', () => {
    const result = isLight('#000000');
    expect(result).toEqual(false);
  });
  it('returns true for brighter color', () => {
    const result = isLight('#fff17f');
    expect(result).toEqual(true);
  });
});

describe('goals', () => {
  it('creates valid key', () => {
    const result = getGoalKey('pressure', 'min');

    expect(result).toEqual('min_goal_pressure');
  });
});
