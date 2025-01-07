import { makeStyles } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import Tooltip from '~/components/Tooltip';

const useStyles = makeStyles(theme => ({
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.text7,
    '&:hover': {
      color: theme.palette.primary.text1,
      cursor: 'pointer',
    },
    marginLeft: '-24px',
    zIndex: 999,
  },
  closeIcon: {
    width: '16px',
    height: '16px',
  },
}));

export default function CloseSuggestion({ onClose }) {
  const classes = useStyles();
  return (
    <div className={classes.buttonWrapper} onClick={onClose}>
      <Tooltip title="Clear" placement="bottom">
        <CloseIcon className={classes.closeIcon} />
      </Tooltip>
    </div>
  );
}
