import { makeStyles, Typography } from '@material-ui/core';
import CopyToClipboardComponent from './CopyToClipboard';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 8,
  },
});

export const CopyToClipboard = () => {
  const classes = useStyles();
  return (
    <Typography className={classes.content} component="div">
      Copy me!
      <CopyToClipboardComponent classes={{ icon: classes.icon }}>Copy me!</CopyToClipboardComponent>
    </Typography>
  );
};

CopyToClipboard.storyName = 'CopyToClipboard';

export default {
  title: 'Components/CopyToClipboard',
  component: CopyToClipboard,
  argTypes: {
    classes: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
};
