import { makeStyles } from '@material-ui/core';
import { Theme } from '@/shared/types';

export const useCommentStyles = makeStyles<Theme>(theme => ({
  timeRoot: {
    color: theme.palette.primary.text7,
    float: 'right',
    marginRight: 5,
    marginLeft: 8,
    fontSize: '12px',
  },
  textRoot: {
    marginTop: 5,
    color: '#CCC',
    fontWeight: 'normal',
    fontSize: '14px',
    wordBreak: 'break-word',
  },
  iconButtonRoot: {
    float: 'right',
    visibility: 'hidden',
    color: theme.palette.primary.text7,
  },
  userName: {
    fontSize: '12px',
    fontWeight: 'bold',
  },
}));
