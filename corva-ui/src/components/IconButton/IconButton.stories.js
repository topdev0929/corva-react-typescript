/* eslint-disable react/prop-types */
import SettingsIcon from '@material-ui/icons/Settings';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import IconButtonComponent from '~/components/IconButton';

export const IconButton = props => {
  const isTransparent = props.variant === 'transparent';
  return (
    <div
      style={{
        padding: 24,
        minHeight: isTransparent ? 110 : 64,
        background: isTransparent
          ? 'linear-gradient(to right, #814EE8, #5EA7EA, #6DECEE)'
          : '#1D1D1D',
      }}
    >
      <IconButtonComponent
        {...props}
        tooltipProps={{ title: props.disabled ? 'Disabled' : props.title }}
      >
        <SettingsIcon />
      </IconButtonComponent>
    </div>
  );
};

IconButton.storyName = 'IconButton';

export default {
  title: 'Components/IconButton',
  component: IconButtonComponent,
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['default', 'primary'],
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'contained', 'transparent'],
    },
    disabled: {
      control: 'boolean',
    },
    isActive: {
      control: 'boolean',
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
    title: {
      control: {
        type: 'string',
      },
    },
  },
  args: {
    color: 'default',
    variant: 'default',
    disabled: false,
    isActive: false,
    size: 'medium',
    title: 'Settings',
  },
  parameters: {
    docs: {
      description: {
        component:
          '<div>A wrapper around MUI IconButton component. See more information in MUI docs & story source code',
      },
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/IconButton/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9696%3A17373',
  },
};
