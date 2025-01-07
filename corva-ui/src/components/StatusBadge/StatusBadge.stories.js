import { StatusBadge as StatusBadgeComponent } from '~/components/StatusBadge';

const alert = {
  name: 'Country Check',
  category: 'Category Name',
  status: 'Expired',
  isThrottled: false,
  message:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of. but the majority have suffered alteration in some form, by injected humour. but the majority have suffered alteration in some form, by injected humour",
  note: 'MUD WT IN 16.0 Visc 60 but the majority have suffered alteration',
  statusUpdatedAt: 111111,
  lastCheckedAt: 111111,
};

const assetsData = {
  'LS - 2/4-X-8 B (DC Test/M.Cortez/2023-03-09 15:17:53 UTC)': [
    {
      id: 10,
      name: 'Check Torque and Drag',
      issuesNum: 4,
      missingNum: 0,
      alert: { ...alert, state: 'Issue' },
    },
    { id: 20, name: 'Channels/units', missingNum: 24, issuesNum: 22, alert: { ...alert } },
    { id: 123, name: 'App', isResolved: true, missingNum: 24, issuesNum: 22, alert: { ...alert } },
    { id: 122, name: 'Data', missingNum: 2, issuesNum: 3, alert: { ...alert } },
  ],
  'Asset 2': [
    { id: 21, name: 'Costs', isResolved: true, missingNum: 24, issuesNum: 22, alert: { ...alert } },
    { id: 24, name: 'Daily Reports', missingNum: 2, issuesNum: 3, alert: { ...alert } },
    { id: 44, name: 'Casing', missingNum: 2, issuesNum: 0, alert: { ...alert } },
  ],
  'Asset 3': [
    {
      id: 22,
      name: 'Hydraulics',
      isResolved: true,
      missingNum: 24,
      issuesNum: 22,
      alert: { ...alert },
    },
    { id: 67, name: 'Driller Roadmap', missingNum: 8, issuesNum: 0, alert: { ...alert } },
    { id: 98, name: 'T&D', missingNum: 2, issuesNum: 3, alert: { ...alert } },
    { id: 11, name: 'BHA', missingNum: 4, issuesNum: 1, alert: { ...alert } },
    { id: 55, name: 'Channel', isResolved: true, missingNum: 4, issuesNum: 1, alert: { ...alert } },
  ],
};

export const StatusBadge = ({
  appWidth,
  assetsData,
  iconType,
  lastTimestamp,
  warningData,
  DQIssueTooltipMaxHeight,
}) => {
  return (
    <div style={{ marginTop: 400 }}>
      <StatusBadgeComponent
        assetsData={assetsData}
        appWidth={appWidth}
        DQIssueTooltipMaxHeight={DQIssueTooltipMaxHeight}
        iconType={iconType}
        lastTimestamp={lastTimestamp}
        warningData={warningData}
      />
    </div>
  );
};

export default {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  argTypes: {
    iconType: {
      control: 'inline-radio',
      options: ['success', 'error', ''],
    },
    lastTimestamp: {
      control: 'number',
    },
    DQIssueTooltipMaxHeight: {
      control: 'number',
    },
    warningMessage: {
      control: 'text',
    },
    appWidth: {
      control: 'number',
    },
    assetsData: {
      control: ['object'],
    },
    warningData: {
      control: ['object'],
    },
    segment: {
      control: 'inline-radio',
      options: ['drilling', 'completions'],
    },
    currentUser: {
      control: ['object'],
    },
  },
  args: {
    iconType: 'success',
    lastTimestamp: 1674834480,
    DQIssueTooltipMaxHeight: 400,
    warningMessage: '',
    appWidth: 500,
    assetsData,
    warningData: {},
    segment: 'drilling',
    currentUser: {},
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/StatusBadge/index.js',
    designLink:
      'https://www.figma.com/file/BdbkhI5n7vGqEVBewDCtax/Data-Quality?node-id=692%3A79952&t=xzfZLvcegdB7MZCw-1',
  },
};
