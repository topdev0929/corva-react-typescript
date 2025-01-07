/* eslint-disable react/prop-types */
import moment from 'moment';
import { Typography, makeStyles } from '@material-ui/core';

const PAGE_NAME = 'FeedPo';

const useStyles = makeStyles(theme => ({
  createdAtRoot: {
    color: theme.palette.primary.text6,
    minWidth: '100px',
  },
}));

const CREATED_AT_FORMAT = 'MM/DD/YY H:mm';

const CreatedAt = ({ feedItem }) => {
  const classes = useStyles();
  return (
    <Typography
      variant="body2"
      data-testid={`${PAGE_NAME}_createdPostDate`}
      className={classes.createdAtRoot}
    >
      {moment(feedItem.created_at).format(CREATED_AT_FORMAT)}
    </Typography>
  );
};

export default CreatedAt;
