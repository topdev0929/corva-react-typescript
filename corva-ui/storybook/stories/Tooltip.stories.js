/* eslint-disable react/prop-types */

import { Tooltip as TooltipComponent, Button } from '@material-ui/core';
import { ScrollableTooltip } from '~/components/Tooltip';

const assets = [
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 1 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 2 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 3 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 4 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 5 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 6 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 7 },
  { name: 'Offset Well Name Name', id: 8 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 9 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 10 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 11 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 12 },
  { name: 'Offset Well Name Name', id: 13 },
  { name: 'Offset Well Name Name', id: 14 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 15 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 16 },
  { name: 'Offset Well Name Name', id: 17 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 18 },
  { name: 'Offset Well Name Name', id: 19 },
  { name: 'Offset Well Name Name', id: 20 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 21 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 22 },
  { name: 'Offset Well Name Name', id: 23 },
  { name: 'Offset Well Name Name ... Offset Well Name Name', id: 24 },
];

// eslint-disable-next-line react/prop-types
export const Tooltip = props => {
  return (
    <div style={{ paddingTop: 80, marginLeft: 80 }}>
      <TooltipComponent title="Create" placement="left" {...props.muiTooltipProps}>
        <Button size="small">Tooltip</Button>
      </TooltipComponent>
    </div>
  );
};

export const FullscreenTooltip = props => {
  return (
    <div style={{ paddingTop: 10, marginLeft: 10 }}>
      <ScrollableTooltip
        title={assets.map(({ name, id }, idx) => (
          <div
            key={id}
            style={{
              margin: `${idx !== 0 ? '4px 0' : '0'}`,
              fontSize: '14px',
              lineHeight: '20px',
            }}
          >
            {name}
          </div>
        ))}
        placement="right"
        staticTitle="Missing Time log Data for 100 wells:"
        {...props.muiTooltipProps}
      >
        <Button size="small">Tooltip</Button>
      </ScrollableTooltip>
    </div>
  );
};

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          '<div>Use MUI Tooltips. More information <a href="https://material-ui.com/components/tooltips/">here</a></div>',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9597%3A19173',
  },
  argTypes: {
    muiTooltipProps: {
      name: '...muiTooltipProps',
      description:
        '<a href="https://v4.mui.com/api/tooltip/#tooltip-api" target="_blank">MUI Tooltip API</a>',

      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
      control: {
        type: 'object',
      },
    },
  },
};
