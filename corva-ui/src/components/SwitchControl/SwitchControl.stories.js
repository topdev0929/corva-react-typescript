import { useState } from 'react';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import SwitchControl, { SwitchControlComponent } from '~/components/SwitchControl';

export const SwitchWithLabels = props => {
  const [isChecked, setIsChecked] = useState(false);
  const onChange = e => {
    setIsChecked(e.target.checked);
  };

  return (
    <div>
      <SwitchControl
        title="Switch Control with labels"
        leftLabel="Left"
        rightLabel="Right"
        color="primary"
        checked={isChecked}
        onChange={onChange}
        {...props}
      />
      <SwitchControl
        title="Small Disabled Switch Control with labels"
        leftLabel="Left"
        rightLabel="Right"
        color="primary"
        checked={isChecked}
        onChange={onChange}
        disabled
        size="small"
        {...props}
      />
    </div>
  );
};

export const SwitchWithOneLabel = props => {
  const [isChecked, setIsChecked] = useState(false);
  const onChange = e => {
    setIsChecked(e.target.checked);
  };

  return (
    <div>
      <SwitchControl
        title="Switch Control with one label"
        rightLabel="Right"
        color="primary"
        checked={isChecked}
        onChange={onChange}
        {...props}
      />
      <SwitchControl
        title="Small Disabled Switch Control with one label"
        rightLabel="Right"
        color="primary"
        checked={isChecked}
        onChange={onChange}
        disabled
        size="small"
        {...props}
      />
    </div>
  );
};

export const SwitchWithoutLabels = props => {
  const [isChecked, setIsChecked] = useState(false);
  const onChange = e => {
    setIsChecked(e.target.checked);
  };

  return (
    <div>
      <SwitchControl
        title="Switch Control without labels"
        color="primary"
        checked={isChecked}
        onChange={onChange}
        {...props}
      />
      <SwitchControl
        title="Small Disabled Switch Control without labels"
        color="primary"
        checked={isChecked}
        onChange={onChange}
        disabled
        size="small"
        {...props}
      />
    </div>
  );
};

export default {
  title: 'Components/SwitchControl',
  component: SwitchControlComponent,
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/SwitchControl/index.js',
  },
};
