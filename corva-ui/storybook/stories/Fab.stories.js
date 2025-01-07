/* eslint-disable react/prop-types */

import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

export const PrimaryFab = props => (
  <Fab color="primary" {...props.muiFabProps}>
    <AddIcon />
  </Fab>
);

export default {
  title: 'Components/Fab',
  component: PrimaryFab,
  argTypes: {
    muiFabProps: {
      name: '...muiFabProps',
      description: '<a href="https://v4.mui.com/api/fab/#fab-api" target="_blank">MUI Fab API</a>',
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
    docs: {
      description: {
        component:
          '<div>A wrapper around MUI Fab component. See more information in MUI docs & story source code',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9666%3A18025',
  },
};
