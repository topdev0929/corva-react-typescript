/* eslint-disable react/prop-types */
import { Avatar, makeStyles } from '@material-ui/core';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import Chip from '~/components/Chip';

const Status = () => (
  <div
    style={{
      border: '4px solid #75DB29',
      borderRadius: '50%',
      marginLeft: 12,
      marginRight: '-8px',
    }}
  />
);

const useStyles = makeStyles({
  container: {
    '& .MuiChip-root': {
      marginRight: 16,
    },
  },
});

export const Default = props => <Chip label="Chip label" {...props} {...props.muiChipProps} />;

export const Chips = props => {
  const styles = useStyles();

  const handleDelete = props.deletable ? () => {} : null;

  return (
    <div className={styles.container}>
      <Chip onDelete={handleDelete} onClick={() => {}} {...props} />
      <Chip onDelete={handleDelete} onClick={() => {}} avatar={<Avatar />} {...props} />
      <Chip onDelete={handleDelete} onClick={() => {}} icon={<InsertEmoticonIcon />} {...props} />
      <Chip onDelete={handleDelete} onClick={() => {}} {...props} icon={<Status />} />
    </div>
  );
};

Chips.argTypes = {
  variant: {
    control: 'inline-radio',
    options: ['default', 'outlined'],
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'default' },
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
  checked: {
    control: {
      type: 'boolean',
    },
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
  deletable: {
    control: {
      type: 'boolean',
    },
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
  size: {
    control: 'inline-radio',
    options: ['small', 'medium'],
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'medium' },
    },
  },
  label: {
    control: {
      type: 'text',
    },
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'Label' },
    },
  },
};

export default {
  title: 'Components/Chip',
  component: Chip,
  excludeStories: ['Avatar'],
  argTypes: {
    muiChipProps: {
      name: '...muiChipProps',
      description:
        '<a href="https://v4.mui.com/api/chip/#chip-api" target="_blank">MUI Chip API</a>',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
      control: {
        type: 'object',
      },
    },
  },
  args: {
    disabled: false,
    checked: false,
    deletable: false,
    label: 'Label',
    size: 'medium',
    variant: 'default',
  },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Chip/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=19105%3A59510',
  },
};
