/* eslint-disable react/prop-types */

import { useState } from 'react';

import EditIcon from '@material-ui/icons/Edit';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import { ToggleButtonGroup, ToggleButton as ToggleButtonComponent } from '@material-ui/lab';
import { Typography, Tooltip } from '@material-ui/core';

const TABS = [
  {
    label: 'Tab 1',
    key: 'tab_1',
  },
  {
    label: 'Tab 2',
    key: 'tab_2',
    disabled: true,
  },
  {
    label: 'Tab 3',
    key: 'tab_3',
  },
  {
    label: 'Tab 4',
    key: 'tab_4',
  },
];

const ICONS = size => {
  const fontSize = size === 'small' ? 16 : 24;
  return [
    {
      label: <EditIcon style={{ fontSize }} />,
      key: 'tab_1',
    },
    {
      label: <PhoneAndroidIcon style={{ fontSize }} />,
      key: 'tab_2',
      disabled: true,
    },
    {
      label: <SettingsIcon style={{ fontSize }} />,
      key: 'tab_3',
    },
    {
      label: <CloseIcon style={{ fontSize }} />,
      key: 'tab_4',
    },
  ];
};

export const ToggleButton = props => {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [isTooltipLargeShown, setIsTooltipLargeShown] = useState(false);
  const [isTooltipLargeIconsShown, setIsTooltipLargeIconsShown] = useState(false);
  const [isTooltipMediumShown, setIsTooltipMediumShown] = useState(false);
  const [isTooltipMediumIconsShown, setIsTooltipMediumIconsShown] = useState(false);
  const [isTooltipSmallShown, setIsTooltipSmallShown] = useState(false);
  const [isTooltipSmallIconsShown, setIsTooltipSmallIconsShown] = useState(false);

  const onTabChange = (e, active) => {
    setActiveTab(active);
  };

  return (
    <div style={{ width: '100%', padding: 16 }}>
      <div style={{ padding: '16px 0' }}>
        <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
          Large
        </Typography>
        <ToggleButtonGroup value={activeTab} onChange={onTabChange} size="large" exclusive>
          {TABS.map(({ label, key, disabled }) => {
            return disabled ? (
              <Tooltip placement="top" title="Disabled" open={isTooltipLargeShown}>
                <ToggleButtonComponent
                  key={key || label}
                  disabled={disabled}
                  value={key}
                  size="large"
                  onMouseOver={() => setIsTooltipLargeShown(true)}
                  onMouseOut={() => setIsTooltipLargeShown(false)}
                  {...props.muiToggleButtonProps}
                >
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            ) : (
              <ToggleButtonComponent
                key={key || label}
                disabled={disabled}
                value={key}
                {...props.muiToggleButtonProps}
              >
                {label}
              </ToggleButtonComponent>
            );
          })}
        </ToggleButtonGroup>
      </div>
      <div style={{ padding: '16px 0' }}>
        <ToggleButtonGroup value={activeTab} onChange={onTabChange} size="large" exclusive>
          {ICONS('medium').map(({ label, key, disabled }) => {
            return disabled ? (
              <Tooltip placement="top" title="Disabled" open={isTooltipLargeIconsShown}>
                <ToggleButtonComponent
                  key={key || label}
                  disabled={disabled}
                  value={key}
                  size="large"
                  onMouseOver={() => setIsTooltipLargeIconsShown(true)}
                  onMouseOut={() => setIsTooltipLargeIconsShown(false)}
                  {...props.muiToggleButtonProps}
                >
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="Action">
                <ToggleButtonComponent
                  key={key || label}
                  disabled={disabled}
                  value={key}
                  {...props.muiToggleButtonProps}
                >
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            );
          })}
        </ToggleButtonGroup>
      </div>
      <div style={{ padding: '16px 0' }}>
        <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
          Medium
        </Typography>
        <ToggleButtonGroup value={activeTab} onChange={onTabChange} size="medium" exclusive>
          {TABS.map(({ label, key, disabled }) => {
            return disabled ? (
              <Tooltip placement="top" title="Disabled" open={isTooltipMediumShown}>
                <ToggleButtonComponent
                  key={key || label}
                  disabled={disabled}
                  value={key}
                  size="medium"
                  onMouseOver={() => setIsTooltipMediumShown(true)}
                  onMouseOut={() => setIsTooltipMediumShown(false)}
                >
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            ) : (
              <ToggleButtonComponent key={key || label} disabled={disabled} value={key}>
                {label}
              </ToggleButtonComponent>
            );
          })}
        </ToggleButtonGroup>
      </div>
      <div style={{ padding: '16px 0' }}>
        <ToggleButtonGroup value={activeTab} onChange={onTabChange} size="medium" exclusive>
          {ICONS('medium').map(({ label, key, disabled }) => {
            return disabled ? (
              <Tooltip placement="top" title="Disabled" open={isTooltipMediumIconsShown}>
                <ToggleButtonComponent
                  key={key || label}
                  disabled={disabled}
                  value={key}
                  size="medium"
                  onMouseOver={() => setIsTooltipMediumIconsShown(true)}
                  onMouseOut={() => setIsTooltipMediumIconsShown(false)}
                >
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="Action">
                <ToggleButtonComponent key={key || label} disabled={disabled} value={key}>
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            );
          })}
        </ToggleButtonGroup>
      </div>
      <div style={{ padding: '16px 0' }}>
        <Typography variant="h6" component="div" style={{ paddingBottom: 8 }}>
          Small
        </Typography>
        <ToggleButtonGroup value={activeTab} onChange={onTabChange} size="small" exclusive>
          {TABS.map(({ label, key, disabled }) => {
            return disabled ? (
              <Tooltip placement="top" title="Disabled" open={isTooltipSmallShown}>
                <ToggleButtonComponent
                  key={key || label}
                  disabled={disabled}
                  value={key}
                  size="small"
                  onMouseOver={() => setIsTooltipSmallShown(true)}
                  onMouseOut={() => setIsTooltipSmallShown(false)}
                >
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            ) : (
              <ToggleButtonComponent key={key || label} disabled={disabled} value={key}>
                {label}
              </ToggleButtonComponent>
            );
          })}
        </ToggleButtonGroup>
      </div>
      <div style={{ padding: '16px 0' }}>
        <ToggleButtonGroup value={activeTab} onChange={onTabChange} size="small" exclusive>
          {ICONS('small').map(({ label, key, disabled }) => {
            return disabled ? (
              <Tooltip placement="top" title="Disabled" open={isTooltipSmallIconsShown}>
                <ToggleButtonComponent
                  key={key || label}
                  disabled={disabled}
                  value={key}
                  size="small"
                  onMouseOver={() => setIsTooltipSmallIconsShown(true)}
                  onMouseOut={() => setIsTooltipSmallIconsShown(false)}
                >
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="Action">
                <ToggleButtonComponent key={key || label} disabled={disabled} value={key}>
                  {label}
                </ToggleButtonComponent>
              </Tooltip>
            );
          })}
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

ToggleButton.storyName = 'ToggleButton';

export default {
  title: 'Components/ToggleButton',
  component: ToggleButton,
  argTypes: {
    muiToggleButtonProps: {
      name: '...muiToggleButtonProps',
      description:
        '<a href="https://v4.mui.com/api/toggle-button/#togglebutton-api" target="_blank">MUI ToggleButton API</a>',
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
          '<div>A wrapper around MUI Button. More information <a href="https://v4.mui.com/components/buttons/#button">here</a></div>',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=19162%3A59815',
  },
};
