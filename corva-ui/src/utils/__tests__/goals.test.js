import { getCompanyGoalSetting, getPriorityGoalSetting, getProgramGoalSetting } from '../goals';

describe('Utils', () => {
  describe('goals', () => {
    const companyGoals = {
      cumulative_tortuosity_goal: {
        drilling: {
          company: 42,
          program: {
            '1586': 18,
            '2020': Infinity,
          },
        },
      },
    };

    describe('getCompanyGoalSetting', () => {
      it(`returns company goal`, () => {
        expect(getCompanyGoalSetting(companyGoals, 'cumulative_tortuosity_goal')).toBe(42);
      });
    });

    describe('getProgramGoalSetting', () => {
      it(`returns program goal`, () => {
        expect(getProgramGoalSetting(companyGoals, 'cumulative_tortuosity_goal', '1586')).toBe(18);
      });
    });

    describe('getPriorityGoalSetting', () => {
      it(`returns program goal if it's finite`, () => {
        expect(getPriorityGoalSetting(companyGoals, 'cumulative_tortuosity_goal', '1586')).toBe(18);
      });

      it(`returns company goal if program goal isn't finite`, () => {
        expect(getPriorityGoalSetting(companyGoals, 'cumulative_tortuosity_goal', '2020')).toBe(42);
      });
    });
  });
});
