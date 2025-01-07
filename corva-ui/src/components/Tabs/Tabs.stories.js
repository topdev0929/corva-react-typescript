/* eslint-disable react/prop-types */
import { useState } from 'react';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { Tabs as TabsComponent, Tab } from '~/components/Tabs';

export const Tabs = ({ width, ...props }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabsComponent {...props} value={activeTab} onChange={(event, value) => setActiveTab(value)}>
      <Tab label="Label" />
      <Tab label="Label 2" />
      <Tab label="Label Three" />
      <Tab disabled label="Disabled tab" />
    </TabsComponent>
  );
};

export const Scrollable = ({ width, ...props }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabsComponent
      {...props}
      style={{ width: 320 }}
      variant="scrollable"
      type="filled"
      value={activeTab}
      onChange={(event, value) => setActiveTab(value)}
    >
      <Tab label="Label" />
      <Tab label="Label 2" />
      <Tab label="Label Three" />
      <Tab disabled label="Disabled tab" style={{ whiteSpace: 'nowrap' }} />
    </TabsComponent>
  );
};

export default {
  title: 'Components/Tabs',
  component: TabsComponent,
  subcomponents: { Tab },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'filled', 'filledTab'],
    },
    compact: {
      control: 'boolean',
    },
  },
  args: {
    type: 'default',
    compact: false,
  },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Tabs/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9597%3A17644',
  },
};
