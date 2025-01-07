import { useState } from 'react';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import styles from './ExampleApp.css';

import { ParameterCharts, AddEditTrack } from '../components/ParameterCharts';

import asset1 from './data/parametersWitsAndDysfanction.json';
import asset2 from './data/parametersWitsAndDysfanction2.json';

// NOTE: This example app is created just to test the components you implement inside this repo
const mapping = [{"collection":"wits","key":"data.rop","name":"ROP","unit":"ft/h","unitType":"velocity"},{"collection":"wits","key":"data.diff_press","name":"Diff Press","unit":"psi","unitType":"pressure"},{"collection":"wits","key":"data.rotary_rpm","name":"Rotary RPM","unit":"rpm","unitType":"rpm"},{"collection":"wits","key":"data.weight_on_bit","name":"WOB","unit":"klbf","unitType":"force"},{"collection":"wits","key":"data.mud_flow_in","name":"Flow In","unit":"gal/min","unitType":"volumeFlowRate"},{"collection":"wits","key":"data.hook_load","name":"Hook load","unit":"klbf","unitType":"force"},{"collection":"wits","key":"data.standpipe_pressure","name":"Standpipe Pressure","unit":"psi","unitType":"pressure"},{"collection":"wits","key":"data.rotary_torque","name":"Rotary Torque","unit":"ft-klbf","unitType":"torque"},{"collection":"drillingDysfunction","key":"health.lateral.rms_avg_health","name":"Lateral RMS Average","unit":"gRMS","unitType":"gravityRMS"},{"collection":"drillingDysfunction","key":"health.axial.rms_avg_health","name":"Axial RMS Average","unit":"gRMS","unitType":"gravityRMS"},{"collection":"drillingDysfunction","key":"health.lateral.peak_shock_count_health","name":"Shock Lateral g","unit":"g","unitType":"gravity"},{"collection":"drillingDysfunction","key":"health.axial.peak_shock_count_health","name":"Shock Axial g","unit":"g","unitType":"gravity"},{"collection":"wits","key":"data.continuous_inclination","name":"Continuous Inclination","unit":"deg","unitType":"angle"},{"collection":"wits","key":"data.gamma_ray","name":"Gamma","unit":"api","unitType":"api"},{"collection":"wits","key":"data.gravity_tool_face_mean","name":"Toolface3","unit":"deg","unitType":"angle"}];
const indexes = {"min":20254.71,"max":20255.90,"keys":{"wits":{"key":"data.hole_depth","collection":"wits","name":"Depth","unit":"ft","unitType":"length"},"drillingDysfunction":{"key":"md","collection":"drillingDysfunction","name":"Depth","unit":"ft","unitType":"length"}}};

const singleChannelData = { asset1, asset2 };
const regularData = asset1;

const regularSettings = {"parameterChart":[{"id":"edb11f70-9e81-11eb-91ec-8d4896ed058f","name":"New Track","traces":[{"unit":"ft-klbf","name":"Rotary Torque","lineColor":"#72bb1b","lineWidth":1,"autoScale":true,"id":"b5e6d27e-a7e2-46d1-91ba-0e7de36b7c2d","collection":"wits","unitType":"torque","dashStyle":"Solid","traceType":"line","key":"data.rotary_torque"},{"traceType":"line","dashStyle":"Solid","color":"#ccc","lineWidth":1,"autoScale":true,"key":"data.diff_press","collection":"wits","name":"Diff Press","unit":"psi","unitType":"pressure","id":"30745428-575b-4856-8276-899d0af0b232"}]},{"name":"New Track","traces":[{"traceType":"line","dashStyle":"Dash","color":"#f10e0e","lineWidth":1,"autoScale":true,"key":"data.rop","collection":"wits","name":"ROP","unit":"ft/h","unitType":"velocity","id":"4b8e6dfd-34a6-427d-ad9a-6f12037c8125"}],"id":"df3d5eb0-9f60-11eb-b60b-9db340114f36"}]};
const singleChannelSettings =  {"parameterChart":[{"name":"New Track","traces":[{"traceType":"line","dashStyle":"Solid","lineColor":"#ccc","lineWidth":1,"autoScale":true,"key":"data.weight_on_bit","id":"data.weight_on_bit","collection":"wits","name":"WOB","unit":"klbf","unitType":"force"}],"assets":["asset1","asset2"],"id":"934968d0-b31c-11eb-9063-538e9feb03b1","value":"data.rop"},{"name":"New Track","traces":[{"traceType":"line","dashStyle":"Solid","lineColor":"#ccc","lineWidth":1,"autoScale":true,"key":"data.rop","id":"data.rop","collection":"wits","name":"ROP","unit":"ft/h","unitType":"velocity"}],"id":"6a58e280-b49c-11eb-8380-3fb2746bd585"}]}

const isSingleChannelEnabled = true;

function ExampleApp() {
  const [settings, setSettings] = useState(isSingleChannelEnabled ? singleChannelSettings : regularSettings);
  return (
    <div className={styles.exampleApp}>
      <p>Settings {JSON.stringify(settings)}</p>
      <AddEditTrack settings={settings} onSettingsChange={setSettings} mapping={mapping} multipleAssets>
        <AddCircleOutline color="primary" fontSize="small" />
      </AddEditTrack>
      <ParameterCharts
        data={isSingleChannelEnabled ? singleChannelData : regularData}
        mapping={mapping}
        settings={settings}
        onSettingsChange={setSettings}
        horizontal
        indexes={indexes}
        isLoading={false}
        multipleAssets={isSingleChannelEnabled}
        // settingsKey
        assestColors={{ asset1: '#FF0000', asset2: '#1E90FF' }}
      />
    </div>
  );
}

export default ExampleApp;
