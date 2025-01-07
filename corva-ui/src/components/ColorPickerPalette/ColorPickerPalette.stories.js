import { useState } from 'react';

import { makeStyles } from '@material-ui/core';
import PaletteChromePicker from '~/components/ColorPicker/PaletteChromePicker/PaletteChromePicker';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import ColorPickerPaletteComponent from '~/components/ColorPickerPalette';

const converters = ['rgba', 'rgb', 'hex', 'rgba_rgb', 'rgba_hex'];
const popoverAnchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};
const popoverTransformOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

const useStyles = makeStyles(() => ({
  customButton: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: ({ color }) => color,
    padding: 10,
  },
}));

export const ColorPickerPalette = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles({ color: props.color });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = e => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <div className={classes.customButton} onClick={handleOpen} />
      <ColorPickerPaletteComponent
        color={props.color}
        onChange={props.onChange}
        anchorEl={anchorEl}
        handleClose={handleClose}
        {...props}
      />
    </>
  );
};

ColorPickerPalette.storyName = 'ColorPickerPalette';

ColorPickerPalette.defaulrProps = {
  pickerComponent: PaletteChromePicker,
};

export default {
  title: 'Components/ColorPickerPalette',
  component: ColorPickerPalette,
  argTypes: {
    color: {
      type: { required: true },
      description: 'Selected color value',
      table: {
        type: { summary: 'string' },
      },
      control: {
        type: 'color',
      },
    },
    onChange: {
      type: { required: true },
      description: 'On change handler.',
      table: {
        type: {
          name: 'function',
          summary: `(newColor) => void`,
        },
      },
      control: false,
    },
    anchorEl: {
      type: { required: true },
      description: 'DOM element for binding popover',
      table: {
        type: {
          summary: 'HTMLElement',
        },
      },
      control: false,
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
    pickerComponent: {
      description:
        "Component which used as a color picker. By default it's corva-ui PaletteChromePicker",
      table: { type: { summary: 'node' } },
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
    converter: 'rgba_hex',
  },
  parameters: {
    controls: {
      expanded: true,
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/ColorPickerPalette/ColorPickerPalette.js',
    designLink: 'https://www.figma.com/file/smNVlGhHv4dyuH5Q22pxAS/CrossPlot?node-id=1580%3A148784',
  },
};
