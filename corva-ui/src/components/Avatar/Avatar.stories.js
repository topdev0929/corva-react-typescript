/* eslint-disable react/prop-types */
import { Grid } from '@material-ui/core';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import Avatar, { AvatarComponent } from '~/components/Avatar';

import starImage from '~/../storybook/assets/star.png';

export const Default = props => {
  return <Avatar {...props} />;
};

export const DifferentSizes = props => (
  <>
    <Grid container spacing={2}>
      <Grid item>
        <Avatar {...props} size={24} imgSrc={starImage} />
      </Grid>
      <Grid item>
        <Avatar {...props} size={24} />
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item>
        <Avatar {...props} size={32} imgSrc={starImage} />
      </Grid>
      <Grid item>
        <Avatar {...props} size={32} />
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item>
        <Avatar {...props} size={40} imgSrc={starImage} />
      </Grid>
      <Grid item>
        <Avatar {...props} size={40} />
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item>
        <Avatar {...props} size={48} imgSrc={starImage} />
      </Grid>
      <Grid item>
        <Avatar {...props} size={48} />
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item>
        <Avatar {...props} size={128} imgSrc={starImage} />
      </Grid>
      <Grid item>
        <Avatar {...props} size={128} />
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item>
        <Avatar {...props} size={200} imgSrc={starImage} />
      </Grid>
      <Grid item>
        <Avatar {...props} size={200} />
      </Grid>
    </Grid>
  </>
);

export default {
  title: 'Components/Avatar',
  component: AvatarComponent,
  argTypes: {
    // don't show classes prop in table as it's used only internally
    classes: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Avatar/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=19105%3A59473',
  },
};
