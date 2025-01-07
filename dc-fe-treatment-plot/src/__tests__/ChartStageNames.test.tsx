import {
  getStageNamesInfo,
  calculateStageNameItemStyles,
  getTruncatedAssetName,
} from '@/components/ChartStageNames/utils';
import { GroupedWitsData } from '@/types/Data';

const mockWitsData = [
  {
    asset_id: 1,
    asset_name: 'Test well 1',
    stage_number: 5,
    wits: [
      {
        timestamp: 1693214580,
        wellhead_pressure: 10,
      },
      {
        timestamp: 1693221780,
        wellhead_pressure: 10,
      },
    ],
  },
  {
    asset_id: 2,
    asset_name: 'Test well 2',
    stage_number: 2,
    wits: [
      {
        timestamp: 1693222800,
        wellhead_pressure: 10,
      },
      {
        timestamp: 1693228200,
        wellhead_pressure: 10,
      },
    ],
  },
  {
    asset_id: 1,
    asset_name: 'Test well 1',
    stage_number: 6,
    wits: [
      {
        timestamp: 1693229100,
        wellhead_pressure: 10,
      },
      {
        timestamp: 1693238410,
        wellhead_pressure: 10,
      },
    ],
  },
];

jest.mock('@/utils/textWidth', () => {
  return {
    getTextWidth: string => string.length * 6,
  };
});

const getStageCaption = (
  containerWidth: number,
  witsData: GroupedWitsData[]
): { assetName: string; tooltip: string }[] => {
  const assetTimeLimits = {
    startValue: witsData.at(0).wits.at(0).timestamp,
    endValue: witsData.at(-1).wits.at(-1).timestamp,
  };
  const stageNamesInfo = getStageNamesInfo({
    data: witsData,
    isZoomedIn: false,
    isAssetViewer: false,
  });
  const secondsPerPixel = (assetTimeLimits.endValue - assetTimeLimits.startValue) / containerWidth;

  return stageNamesInfo.map(stageNameInfo => {
    const captionStyles = calculateStageNameItemStyles({
      ...stageNameInfo,
      secondsPerPixel,
      assetTimeLimits,
      isSingleStage: witsData.length === 1,
      isLive: false,
    });
    return getTruncatedAssetName(
      captionStyles.styles.width,
      stageNameInfo.stageNumber,
      stageNameInfo.assetName
    );
  });
};

describe('ChartStageNames', () => {
  it('should render single stage caption', () => {
    const result = getStageCaption(500, [mockWitsData[0]]);
    expect(result).toStrictEqual([
      {
        assetName: 'Test well 1',
        tooltip: '',
      },
    ]);
  });

  it('should render 3 stage caption with sufficient width', () => {
    const result = getStageCaption(700, mockWitsData);
    expect(result).toStrictEqual([
      {
        assetName: 'Test well 1',
        tooltip: '',
      },
      {
        assetName: 'Test well 2',
        tooltip: '',
      },
      {
        assetName: 'Test well 1',
        tooltip: '',
      },
    ]);
  });

  it('should truncate stage captions with small width', () => {
    const result = getStageCaption(200, mockWitsData);
    expect(result).toStrictEqual([
      {
        assetName: 'Tes...l 1',
        tooltip: '5 Test well 1',
      },
      {
        assetName: 'Te...2',
        tooltip: '2 Test well 2',
      },
      {
        assetName: 'Test...ll 1',
        tooltip: '6 Test well 1',
      },
    ]);
  });
});
