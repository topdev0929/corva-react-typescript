import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';

import { BADGE_ICONS, BadgeIconStatus } from '../constants';

const useStyles = makeStyles(theme => ({
  small: { fontSize: '16px' },
  warning: { color: theme.palette.warning.main },
  issue: { color: '#ffa500' },
  error: { color: theme.palette.error.main },
  success: { color: theme.palette.success.bright },
}));

type iconProps = {
  color: BadgeIconStatus;
  className?: string;
  iconType: BadgeIconStatus;
};

export const DQStatusIcon = ({ color, className, iconType }: iconProps): JSX.Element => {
  const IconComponent = BADGE_ICONS[iconType];
  const classes = useStyles();

  return (
    <IconComponent className={classNames(classes.small, classes[color], className)} />
  );
};
