import { useState } from 'react';
import PropTypes from 'prop-types';

import PaletteChromePicker from '~/components/ColorPicker/PaletteChromePicker/PaletteChromePicker';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import ColorPickerComponent from '~/components/ColorPicker';

const converters = ['rgba', 'rgb', 'hex', 'rgba_rgb', 'rgba_hex'];
const popoverAnchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};
const popoverTransformOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

const tooltipProps = {
  title: 'Change Color',
  placement: 'bottom',
};

export const ColorPicker = props => {
  const [color, setColor] = useState(props.value);

  return (
    <div>
      <ColorPickerComponent value={color} onChange={setColor} {...props} />
    </div>
  );
};

ColorPicker.storyName = 'ColorPicker';

ColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
};

ColorPicker.defaulrProps = {
  pickerComponent: PaletteChromePicker,
};

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  argTypes: {
    value: {
      type: { required: true },
      description: 'Selected color value',
      table: {
        type: { summary: 'string' },
      },
      control: {
        type: 'color',
      },
    },
    label: {
      description: 'Label for ColorPicker',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Color' },
      },
      control: {
        type: 'text',
      },
    },
    onChange: {
      type: { required: true },
      description: 'On change handler.',
      table: {
        type: {
          name: 'function',
          summary: `() => void`,
        },
      },
      control: false,
    },
    tooltipProps: {
      type: { required: false },
      description: 'Tooltip props',
      table: {
        type: { summary: 'object' },
        defaultValue: {
          summary: JSON.stringify(tooltipProps),
        },
      },
      control: {
        type: 'object',
      },
    },
    converter: {
      description: 'Converter which will be used to convert color value',
      table: {
        type: { summary: converters.map(e => `${e}`).join(' | ') },
        defaultValue: { summary: 'rgba_hex' },
      },
      control: {
        options: converters,
        type: 'select',
      },
    },
    buttonClassName: {
      description: 'CSS class which passed to the picker button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'null' },
      },
    },
    pickerComponent: {
      description:
        "Component which used as a color picker. By default it's corva-ui PaletteChromePicker",
      table: { type: { summary: 'node' } },
    },
    labelPosition: {
      description: 'Position of label',
      table: {
        type: { summary: '"top" | "right"' },
        defaultValue: { summary: 'top' },
      },
      control: 'inline-radio',
      options: ['top', 'right'],
    },
    popoverAnchorOrigin: {
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: JSON.stringify(popoverAnchorOrigin) },
      },
      control: {
        type: 'object',
      },
    },
    popoverTransformOrigin: {
      table: {
        type: { summary: 'object' },
        defaultValue: {
          summary: JSON.stringify(popoverTransformOrigin),
        },
      },
      control: {
        type: 'object',
      },
    },
    hideLabel: {
      description: 'Allow hide picker label',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
      control: {
        type: 'boolean',
      },
    },
    lensColor: {
      description: 'Color of picker lens',
      table: {
        type: { summary: 'string' },
      },
      control: {
        type: 'color',
      },
    },
    enableTransparencyPalette: {
      description: 'Enable palette with transparent predefined color',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    enableTransparencyPalette: false,
    lensColor: '#fff',
    hideLabel: false,
    labelPosition: 'top',
    converter: 'rgba_hex',
    label: 'Color',
    value: '#FF2272',
  },
  parameters: {
    controls: {
      expanded: true,
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/ColorPicker/ColorPicker.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=19119%3A59766',
  },
};
