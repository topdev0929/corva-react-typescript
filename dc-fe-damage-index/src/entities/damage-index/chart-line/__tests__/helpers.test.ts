import {
  getWellNameFromLine,
  generateLinesForActiveWell,
  generateLinesForOffsetWells,
  MARKER_URL,
} from '../index';
import { mockedExtendedDiList, mockedSortedDiList } from '../../../../mocks/di';
import { mockedWells } from '../../../../mocks/well';
import { mockedBHAs } from '../../../../mocks/bha';
import { LINE_CHART_CONFIG } from '../../../../constants';

describe('getWellNameFromLine function', () => {
  it('should return well name from line name', () => {
    expect(getWellNameFromLine('well - bha')).toEqual('well');
  });
});

describe('Generate lines', () => {
  let well;
  let bhasToRemove;

  beforeEach(() => {
    [well] = mockedWells;
    bhasToRemove = [mockedBHAs[2]];
  });

  it('should generate lines for active well', () => {
    expect(
      generateLinesForActiveWell(mockedSortedDiList, well, bhasToRemove, 'time', 'value')
    ).toEqual([
      {
        points: [
          {
            x: 13589012,
            y: 1.8,
            marker: { enabled: true, symbol: MARKER_URL },
            custom: { index: 1.8, time: 13589012, depth: 7593, rop: 24 },
          },
        ],
        isActive: true,
        name: `${well.name} - bha 1`,
        color: LINE_CHART_CONFIG.CURRENT_WELL_COLOR,
        showInLegend: true,
      },
      {
        points: [
          {
            x: 13589002,
            y: 1.6,
            marker: { enabled: false, symbol: undefined },
            custom: { index: 1.6, time: 13589002, depth: 4665, rop: 25 },
          },
        ],
        isActive: true,
        name: `${well.name} - bha 2`,
        color: LINE_CHART_CONFIG.CURRENT_WELL_COLOR,
        showInLegend: false,
      },
    ]);
  });

  it('should generate lines for offset wells', () => {
    expect(generateLinesForOffsetWells([[well, mockedExtendedDiList]], 'normDepth', 'rop')).toEqual(
      [
        {
          points: [
            {
              x: 7000,
              y: 16,
              marker: { enabled: false, symbol: undefined },
              custom: { index: 1.79, time: 13589010, depth: 7593, rop: 16 },
            },
            {
              x: 7593,
              y: 24,
              marker: { enabled: false, symbol: undefined },
              custom: { index: 1.8, time: 13589012, depth: 7593, rop: 24 },
            },
          ],
          isActive: false,
          name: `${well.name} - bha 1`,
          color: LINE_CHART_CONFIG.COLORS[0],
          showInLegend: true,
        },
        {
          points: [
            {
              x: 7593,
              y: 25,
              marker: { enabled: false, symbol: undefined },
              custom: { index: 1.6, time: 13589002, depth: 4665, rop: 25 },
            },
          ],
          isActive: false,
          name: `${well.name} - bha 2`,
          color: LINE_CHART_CONFIG.COLORS[0],
          showInLegend: false,
        },
        {
          points: [
            {
              x: 7593,
              y: 24,
              marker: { enabled: false, symbol: undefined },
              custom: { index: 0.5, time: 12415611, depth: 2874, rop: 24 },
            },
          ],
          isActive: false,
          name: `${well.name} - bha 3`,
          color: LINE_CHART_CONFIG.COLORS[0],
          showInLegend: false,
        },
      ]
    );
  });
});
