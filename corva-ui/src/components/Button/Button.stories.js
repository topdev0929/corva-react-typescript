/* eslint-disable react/prop-types */

import { Box } from '@material-ui/core';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import Button from '~/components/Button';

export const Default = props => (
  <Button {...props} {...props.muiButtonProps}>
    Click me!
  </Button>
);

const ButtonWithIcon = props => (
  <Button
    style={{ marginBottom: '16px' }}
    {...props}
    {...props.muiButtonProps}
  >
    Button
  </Button>
);

export const ButtonsWithIcon = props => (
  <Box display="flex" flexDirection="column" alignItems="flex-start">
    <h2>Button with start icon</h2>
    <ButtonWithIcon {...props} startIcon={<BubbleChartIcon />} size="large" />
    <ButtonWithIcon {...props} startIcon={<BubbleChartIcon />} />
    <ButtonWithIcon {...props} startIcon={<BubbleChartIcon />} size="small" />
    <h2>Button with end icon</h2>
    <ButtonWithIcon {...props} endIcon={<BubbleChartIcon />} size="large" />
    <ButtonWithIcon {...props} endIcon={<BubbleChartIcon />} />
    <ButtonWithIcon {...props} endIcon={<BubbleChartIcon />} size="small" />
  </Box>
);

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    muiButtonProps: {
      name: '...muiButtonProps',
      description:
        '<a href="https://v4.mui.com/api/button/#button-api" target="_blank">MUI Button API</a>',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
      control: {
        type: 'object',
      },
    },
  },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Button/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=19105%3A59490',
    docs: {
      description: {
        component:
          '<div>A wrapper around MUI Button. More information <a href="https://v4.mui.com/components/buttons/#button">here</a></div>',
      },
    },
  },
};
