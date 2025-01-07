/* eslint-disable react/prop-types */
import moment from 'moment';
import { Typography, makeStyles } from '@material-ui/core';
import { FC } from 'react';

import { Theme } from '@/shared/types';

const useStyles = makeStyles<Theme>(theme => ({
  createdAtRoot: {
    color: theme.palette.primary.text6,
    minWidth: '100px',
  },
}));

const CREATED_AT_FORMAT = 'MM/DD/YY HH:mm';

type Props = {
  createdAt: string;
};

export const CreatedAt: FC<Props> = ({ createdAt }) => {
  const classes = useStyles();
  return (
    <Typography variant="body2" className={classes.createdAtRoot}>
      {moment(createdAt).format(CREATED_AT_FORMAT)}
    </Typography>
  );
};
