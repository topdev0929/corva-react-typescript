export const mockSettingsProps = {
  onSettingChange: jest.fn(),
  setting: {
    stageMode: 'active',
    lastCustomTime: '0.5',
    customActiveMode: 5,
    viewMode: 'series',
    manualStages: [],
    refPoint: 'isip',
  },
  sideSetting: {
    showRealtimeValues: true,
    showFeedBar: true,
    showLegendBar: true,
    showSlider: true,
    showStreamboxStatus: false,
  },
};
