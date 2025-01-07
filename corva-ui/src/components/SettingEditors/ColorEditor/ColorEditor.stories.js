import { useState } from 'react';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { ColorEditor } from '~/components/SettingEditors';
import { ColorEditor as ColorEditorComponent } from '~/components/SettingEditors/ColorEditor';

export const Default = props => {
  const defaultValue = '#FF0000';
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <ColorEditor
        currentValue={value}
        defaultValue={defaultValue}
        onChange={setValue}
        {...props}
      />
    </div>
  );
};

Default.storyName = 'ColorEditor';

export default {
  title: 'Components/ColorEditor',
  component: ColorEditorComponent,
  argTypes: {
    // don't show classes prop in table as it's used only internally
    classes: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/SettingEditors/ColorEditor/index.js',
  },
};
