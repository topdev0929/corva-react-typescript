import { toWellsOptions, getWellColor, generateWellsKey } from '../index';
import { mockedWellOptions, mockedWells } from '../../../mocks/well';
import { LINE_CHART_CONFIG } from '../../../constants';

describe('toWellsOptions function', () => {
  it('should convert list of well to options for selector', () => {
    expect(toWellsOptions(mockedWells)).toEqual(mockedWellOptions);
  });
});

describe('generateWellsKey function', () => {
  it('should generate key for list of wells', () => {
    expect(generateWellsKey(mockedWells)).toEqual(
      `${mockedWells[0].name}::${mockedWells[1].name}::${mockedWells[2].name}`
    );
  });
});

describe('getWellColor function', () => {
  it('should return color for active well', () => {
    expect(getWellColor(true)).toEqual(LINE_CHART_CONFIG.CURRENT_WELL_COLOR);
  });

  it('should return color for offset well by index', () => {
    const index = 1;
    expect(getWellColor(false, index)).toEqual(LINE_CHART_CONFIG.COLORS[index]);
  });

  it('should return random color for offset well', () => {
    expect(LINE_CHART_CONFIG.COLORS).toContain(getWellColor(false, 10));
  });
});
