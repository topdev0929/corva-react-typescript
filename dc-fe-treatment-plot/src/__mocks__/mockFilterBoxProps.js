import { mockTestAssetId, mockAppProps } from '@/__mocks__/mockAppProps';
import { mockScaleSetting } from '@/__mocks__/mockScaleSetting';
import { mockAppData } from '@/__mocks__/mockAppData';

export const mockFilterBoxProps = {
  onFilterSettingChange: jest.fn(),
  onSettingChange: jest.fn(),
  assetId: mockTestAssetId,
  assetTimeLimits: {
    firstTimestamp: 1683609300,
    lastTimestamp: 1684174506,
  },
  currentStage: 25,
  customChannels: [],
  customTimeSetting: {
    start: null,
    end: null,
  },
  scaleSetting: mockScaleSetting,
  isPadMode: false,
  showManualStages: true,
  dataSetting: {
    selectedPress: ['wellhead_pressure'],
    selectedOffsetPressure: [],
    selectedRate: ['slurry_flow_rate_in'],
    selectedVolumeChemical: [],
    selectedMassChemical: [],
    selectedMassConcentrationProppant: ['total_proppant_concentration'],
    selectedMassProppant: [],
    selectedTotalVolume: [],
    selectedCustomChannels: [],
    selectedHorsepower: [],
  },
  filterSetting: mockAppData.appFilterSetting,
  mappedChemicals: mockAppData.mappedChemicals,
  graphColors: mockAppProps.graphColors,
  offsetPressures: mockAppData.offsetPressures,
};

export const mockFilterBoxEditDialogProps = {
  onScaleSettingChange: jest.fn(),
};
