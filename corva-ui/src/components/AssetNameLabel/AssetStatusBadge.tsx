import { makeStyles, Theme } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles<Theme>(theme => ({
  assetStatus: {
    alignItems: 'center',
    backgroundColor: theme.palette.success.bright,
    borderRadius: 6,
    color: 'black',
    display: 'flex',
    fontSize: 9,
    fontWeight: 500,
    height: 12,
    letterSpacing: '0.1em',
    padding: '0 8px',
    textTransform: 'uppercase',
  },
}));

interface AssetStatusBadgeProps {
  text: string;
  className?: string;
}

export function AssetStatusBadge({ text, className }: AssetStatusBadgeProps): JSX.Element {
  const styles = useStyles();

  if (!text) return null;

  return <div className={classNames(styles.assetStatus, className)}>{text}</div>;
}
