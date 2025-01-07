/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { string, func } from 'prop-types';
import { maxBy, isEmpty } from 'lodash';
import classNames from 'classnames';

import {
  FormControl,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  makeStyles,
} from '@material-ui/core';
import { withPermissionsHOC, PERMISSIONS } from '~/permissions';
import TruncatedText from '~/components/TruncatedText';
import { appPackages } from '~/constants';
import usePackages from './effects';

const { PACKAGE_STATUSES } = appPackages;

const useStyles = makeStyles(theme => ({
  select: { width: 250, margin: '8px 0' },
  menuListRoot: { maxWidth: 580 },
  group: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#999',
    backgroundColor: theme.palette.background.b9,
  },
}));

const PAGE_NAME = 'DC_versionSelect';

// View Component
export const AppVersionsSelectView = ({
  className,
  value,
  onChange,
  isLoading,
  disabled,
  error,
  packages,
}) => {
  const styles = useStyles();

  const [preselectedVersion, setPreselectedVersion] = useState(value);

  const { labeled, unlabeled, packageByValue } = useMemo(() => {
    const packageByValue = {};
    const labeled = [
      {
        label: 'Stable Release - no stable version',
        value: 'PROD',
        disabled: true,
      },
      {
        label: 'Beta - no beta version',
        value: 'BETA',
        disabled: true,
      },
    ];
    const unlabeled = [];

    packages
      // TODO: replace with query param filtering
      .filter(appPackage => appPackage.status !== PACKAGE_STATUSES.FAILURE)
      .forEach(appPackage => {
        const {
          version: apiVersion,
          package_code_version: packageCodeVersion,
          notes,
          label,
          status,
        } = appPackage;
        // NOTE: API version is deprecated, using version from package.json by default
        const version = `v${packageCodeVersion || apiVersion}`;

        if (label) {
          const item = label === 'PROD' ? labeled[0] : labeled[1];
          item.label = `${label === 'PROD' ? 'Stable Release' : 'Beta'} ${version} ${
            notes ? `-  ${notes}` : ''
          }`;
          item.disabled = false;
          packageByValue[item.value] = appPackage;
        } else {
          packageByValue[apiVersion] = appPackage;
          unlabeled.push({
            label: `${version} ${notes ? `-  ${notes}` : ''}`,
            value: apiVersion,
            status,
          });
        }
      });

    return { labeled, unlabeled, packageByValue };
  }, [packages]);

  const handleChange = value => onChange(value, packageByValue[value]);

  const hasUnlabeledVersion = packages.some(appPackage => !appPackage.label);
  const hasPackages = !isEmpty(packages);

  useEffect(() => {
    if (hasPackages && !value) {
      const labeledVersion = labeled.find(item => !item.disabled);

      const version =
        labeledVersion ||
        maxBy(
          unlabeled.filter(item => item.status === PACKAGE_STATUSES.PUBLISHED),
          'value'
        );

      setPreselectedVersion(version?.value);
      handleChange(version?.value);
    }
  }, [labeled, unlabeled]);

  if (isLoading || error) return null;

  return (
    <Grid>
      <FormControl className={classNames(styles.select, className)}>
        <InputLabel shrink={!!(value || preselectedVersion)} htmlFor="appVersion">
          App Version
        </InputLabel>
        <Select
          data-testid={`${PAGE_NAME}_dropdown`}
          value={value || preselectedVersion}
          onChange={e => handleChange(e.target.value)}
          disabled={isLoading || disabled}
          label="App Version"
          inputProps={{
            name: 'appVersion',
            id: 'appVersion',
          }}
          MenuProps={{
            MenuListProps: {
              classes: {
                root: styles.menuListRoot,
              },
            },
          }}
        >
          {hasUnlabeledVersion && (
            <ListSubheader className={styles.group}>
              Labelled Versions (When selected always shows current Beta or Stable Release Versions)
            </ListSubheader>
          )}
          {labeled.map(({ label, value, disabled }) => (
            <MenuItem
              data-testid={`${PAGE_NAME}_option_${label}MenuItem`}
              value={value}
              disabled={disabled}
            >
              {label}
            </MenuItem>
          ))}
          {hasUnlabeledVersion && (
            <ListSubheader className={styles.group}>
              Other versions (App will always show selected version until version is deleted)
            </ListSubheader>
          )}
          {unlabeled.map(({ label, value }) => (
            <MenuItem data-testid={`${PAGE_NAME}_option_${label}MenuItem`} value={value}>
              <TruncatedText>{label}</TruncatedText>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

AppVersionsSelectView.defaultProps = {
  disabled: false,
  error: null,
  isLoading: false,
  packages: [],
  value: null,
};

// Wrapper that fetches packages on its own
const AppVersionsSelect = ({ appId, ...otherProps }) => {
  const packagesState = usePackages(appId, {
    status: [PACKAGE_STATUSES.DRAFT, PACKAGE_STATUSES.PUBLISHED],
    order: 'desc',
    sort: 'created_at',
  });
  return <AppVersionsSelectView {...otherProps} {...packagesState} />;
};

AppVersionsSelect.propTypes = {
  value: string,
  onChange: func.isRequired,
  appId: string.isRequired,
};

AppVersionsSelect.defaultProps = {
  value: null,
};

// Export default with permissions check
export default withPermissionsHOC(
  { canReadAppPackages: ({ appId }) => PERMISSIONS.getCanReadAppPackages(appId) },
  { loader: null }
)(({ canReadAppPackages, ...props }) => canReadAppPackages && <AppVersionsSelect {...props} />);
