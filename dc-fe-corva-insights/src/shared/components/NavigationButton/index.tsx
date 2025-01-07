import { Fab, makeStyles, useTheme } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { FC } from 'react';
import { Tooltip } from '@corva/ui/components';

import { Theme } from '@/shared/types';

type Props = {
  variant: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
};

const useStyles = makeStyles<Theme>(theme => ({
  button: {
    backgroundColor: theme.palette.background.b9,
    '&:hover': {
      backgroundColor: theme.palette.background.b8,
    },
    '&:disabled': {
      backgroundColor: theme.palette.background.b9,
      opacity: 0.6,
    },
  },
}));

export const NavigationButton: FC<Props> = ({ variant, onClick, disabled, testId }) => {
  const theme = useTheme<Theme>();
  const classes = useStyles();

  return (
    <Tooltip title={variant === 'left' ? 'Previous' : 'Next'}>
      <Fab
        onClick={onClick}
        disabled={disabled}
        size="small"
        className={classes.button}
        data-testid={testId}
      >
        {variant === 'left' ? (
          <ChevronLeftIcon htmlColor={theme.palette.primary.text1} />
        ) : (
          <ChevronRightIcon htmlColor={theme.palette.primary.text1} />
        )}
      </Fab>
    </Tooltip>
  );
};
