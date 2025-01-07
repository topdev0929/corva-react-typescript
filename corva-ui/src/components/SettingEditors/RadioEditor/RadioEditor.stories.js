import { useState } from 'react';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import RadioEditorComponent from '~/components/SettingEditors/RadioEditor';

const DATA_RANGES = {
  well: 0,
  holeSection: 1,
  bha: 2,
  hourly: 3,
};

const DATA_RANGE_OPTIONS = [
  { label: 'Well', value: DATA_RANGES.well },
  { label: 'Hole Section', value: DATA_RANGES.holeSection },
  { label: 'BHA', value: DATA_RANGES.bha },
  { label: 'Last 24 hours', value: DATA_RANGES.hourly },
];

export const RadioEditor = props => {
  const [value, setValue] = useState(0);

  return (
    <RadioEditorComponent
      currentValue={value}
      options={DATA_RANGE_OPTIONS}
      onChange={setValue}
      {...props}
    />
  );
};

RadioEditor.storyName = 'RadioEditor';

export default {
  title: 'Components/RadioEditor',
  component: RadioEditorComponent,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/SettingEditors/RadioEditor/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9699%3A1638',
  },
};
