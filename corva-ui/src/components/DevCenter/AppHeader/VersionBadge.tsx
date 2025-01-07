import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

// NOTE: Do not extract these styles to .css file as they are collected for zoid isolated container with ServerStyleSheets
const useStyles = makeStyles(theme => ({
  versionContainer: {
    marginRight: 15,
    display: 'flex',
    position: 'relative',
    height: '20px',
    alignItems: 'center',
    background: theme.palette.background.b6,
    color: theme.palette.primary.text1,
    '&::after': {
      content: "''",
      borderTop: `20px solid ${theme.palette.background.b6}`,
      borderLeft: `5px solid ${theme.palette.background.b6}`,
      borderRight: '5px solid transparent',
      position: 'absolute',
      right: '-10px',
      top: 0,
      paddingLeft: '5px',
    },
  },
  versionContainerBeta: {
    background: '#ee4b69',
    '&::after': {
      borderTop: '20px solid #ee4b69',
      borderLeft: '5px solid #ee4b69',
    },
  },
  versionText: {
    zIndex: 1,
    fontSize: '12px',
    fontStyle: 'italic',
    margin: 0,
    padding: '1px 0 0 5px',
  },
}));

const PAGE_NAME = 'DC_versionBadge';

interface VersionBadgeProps {
  appPackage: {
    label: string;
    version: string;
    package_code_version: string;
  };
}

export const VersionBadge = ({ appPackage }: VersionBadgeProps): JSX.Element => {
  const styles = useStyles();
  if (!appPackage) return null;
  const { label, version, package_code_version: packageCodeVersion } = appPackage;
  if (label === 'PROD') return null;

  return (
    <div className={classNames(styles.versionContainer, label && styles.versionContainerBeta)}>
      <p data-testid={PAGE_NAME} className={styles.versionText}>
        {label ? 'Beta' : `v${packageCodeVersion || version}`}
      </p>
    </div>
  );
};
