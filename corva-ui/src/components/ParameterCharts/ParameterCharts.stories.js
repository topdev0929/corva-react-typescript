import { useState } from 'react';

import AddCircleOutline from '@material-ui/icons/AddCircleOutline';

import { ParameterCharts, AddEditTrack } from '~/components/ParameterCharts';

const dataCollection = [
  {
    _id: '601cf14f46790f2efb3cd09f',
    timestamp: 1612509513,
    data: {
      diff_press_mean: 55,
      gamma_ray_mean: 85,
      standpipe_pressure_mean: 48,
      hole_depth_mean: 10,
    },
  },
  {
    _id: '601cf164e31bd32d76d48b8c',
    timestamp: 1612509526,
    data: {
      diff_press_mean: 65,
      gamma_ray_mean: 45,
      standpipe_pressure_mean: 39,
      hole_depth_mean: 20,
    },
  },
  {
    _id: '601cf17146790f2efb3cd364',
    timestamp: 1612509539,
    data: {
      diff_press_mean: 75,
      gamma_ray_mean: 87,
      standpipe_pressure_mean: 35,
      hole_depth_mean: 30,
    },
  },
  {
    _id: '601cf17ce31bd32df8d47191',
    timestamp: 1612509553,
    data: {
      diff_press_mean: 60,
      gamma_ray_mean: 54,
      standpipe_pressure_mean: 21,
      hole_depth_mean: 40,
    },
  },
  {
    _id: '601cf187e31bd32dd2d47ea0',
    timestamp: 1612509567,
    data: {
      diff_press_mean: 57,
      gamma_ray_mean: 83,
      standpipe_pressure_mean: 79,
      hole_depth_mean: 50,
    },
  },
  {
    _id: '601cf19446790f2f543cc3ea',
    timestamp: 1612509580,
    data: {
      diff_press_mean: 63,
      gamma_ray_mean: 52,
      standpipe_pressure_mean: 59,
      hole_depth_mean: 60,
    },
  },
  {
    _id: '601cf1a1e31bd32dd2d47fbd',
    timestamp: 1612509593,
    data: {
      diff_press_mean: 20,
      gamma_ray_mean: 100,
      standpipe_pressure_mean: 37,
      hole_depth_mean: 70,
    },
  },
];
const mapping = [
  { name: 'DIFF PRESS', key: 'data.diff_press_mean', unit: 'ft', collection: 'dataCollection' },
  { name: 'GAMMA RAY', key: 'data.gamma_ray_mean', unit: 'm', collection: 'dataCollection' },
];

export const HorizontalChart = () => {
  const [settings, setSettings] = useState({});

  return (
    <>
      <AddEditTrack settings={settings} onSettingsChange={setSettings} mapping={mapping}>
        <AddCircleOutline color="primary" fontSize="small" />
      </AddEditTrack>
      <ParameterCharts
        data={{ dataCollection }}
        mapping={mapping}
        settings={settings}
        onSettingsChange={setSettings}
        horizontal
        indexes={{
          min: 18312,
          max: 18323,
          keys: {
            dataCollection: {
              key: 'data.hole_depth_mean',
              name: 'Depth',
              unit: 'ft',
              unitType: 'length',
              collection: 'dataCollection',
            },
          },
        }}
        // settingsKey
      />
    </>
  );
};

export default {
  title: 'Components/Parameter Charts',
  component: ParameterCharts,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
};
