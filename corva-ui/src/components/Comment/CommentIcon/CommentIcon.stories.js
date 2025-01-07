/* eslint-disable react/prop-types */
import { Grid } from '@material-ui/core';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import CommentIcon from '~/components/Comment/CommentIcon';

import starImage from '~/../storybook/assets/star.png';

export const Defult = props => (
  <Grid container>
    <Grid item>
      <CommentIcon displayName="Twenty Four" imgSrc={starImage} {...props} />
    </Grid>
  </Grid>
);

Defult.storyName = 'CommentIcon';

export default {
  title: 'Components/CommentIcon',
  component: CommentIcon,
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Comment/CommentIcon/index.js',
  },
};
