import { useState } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import EmptyState from './EmptyState';

const useStyles = makeStyles({
  root: {},
  textField: { marginRight: 12 },
  container: ({ width, height }) => ({
    boxShadow: '0px 0px 0px 2px rgba(255, 255, 255, 0.6)',
    width,
    height,
    marginTop: 24,
  }),
});

export const EmptyStateStory = ({ title, subtitle, image }) => {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const styles = useStyles({ width, height });

  return (
    <div className={styles.root}>
      <TextField
        className={styles.textField}
        label="Width"
        type="number"
        value={width}
        onChange={e => setWidth(+e.target.value)}
      />
      <TextField
        className={styles.textField}
        label="Height"
        type="number"
        value={height}
        onChange={e => setHeight(+e.target.value)}
      />
      <div className={styles.container}>
        <EmptyState title={title} subtitle={subtitle} image={image} />
      </div>
    </div>
  );
};

export default {
  title: 'Components/Empty State',
  component: EmptyStateStory,
  argTypes: {
    image: {
      options: EmptyState.IMAGES,
      control: 'select',
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: EmptyState.IMAGES.NoDataAvailable },
      },
    },
    title: {
      control: 'text',
      table: {
        type: { summary: 'text' },
        defaultValue: { summary: 'Empty State Title' },
      },
    },
    subtitle: {
      control: 'text',
      table: {
        type: { summary: 'text' },
        defaultValue: { summary: 'Empty State Subtitle' },
      },
    },
  },
  args: {
    image: EmptyState.IMAGES.NoDataAvailable,
    title: 'Empty State Title',
    subtitle: 'Empty State Subtitle',
  },
  parameters: {
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9662-18&t=C6zKC8YvzxNUJ5ka-0',
  },
};
