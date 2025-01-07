import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { ColorPicker, SwitchControl, Tooltip } from '@corva/ui/components';
import { get, isEmpty } from 'lodash';

import { getAssetKey, getDefaultPadModeSetting } from '@corva/ui/utils/completion';
import { GOALS_LIST, WELLHUB_PAGE_MAP } from './constants';

import { getGoalKey, isLight } from './utils/dataUtils';
import { getDashboardSlug } from './api/fetchSlug';
import { resolveCurrentAssetByPadMode } from './utils/completionUtils';
import { useAppWells } from './effects/useAppWells';

const useStyles = makeStyles(theme => ({
  editLink: {
    position: 'absolute',
    right: '0px',
    top: '4px',
  },
  switch: {
    marginLeft: '-14px', // align with App Settings label
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& + &': {
      marginTop: '8px',
    },
  },
  link: {
    color: theme.palette.primary.main,
    fontSize: '14px',
  },
}));

function AppSettings({ settings, onSettingChange, appData }) {
  const { settingsByAsset } = settings;
  const { well, wells, fracFleet } = appData;
  const goalSettings = get(settings, 'goalSettings') || {};
  const [slug, setSlug] = useState('');
  const [initiated, setInitiated] = useState(false);
  const classes = useStyles();

  const assetKey = getAssetKey(fracFleet, well, fracFleet?.current_pad_id);

  const appPadModeSetting = !isEmpty(get(settingsByAsset, [assetKey]))
    ? get(settingsByAsset, [assetKey])
    : getDefaultPadModeSetting(fracFleet, well);
  const selectedWells = useAppWells(well, wells, fracFleet);
  const currentAsset = resolveCurrentAssetByPadMode(selectedWells, appPadModeSetting);

  const assetId = currentAsset?.asset_id;

  const handleChange = (key, value) => {
    onSettingChange('goalSettings', {
      ...goalSettings,
      [key]: value,
    });
  };

  useEffect(() => {
    if (slug || !assetId || initiated) return;
    setInitiated(true);
    getDashboardSlug().then(slug => {
      setSlug(slug);
    });
  }, [slug, assetId, initiated]);

  return (
    <>
      {!!slug && (
        <div className={classes.editLink}>
          <Tooltip title="Edit Goals in Wellhub">
            <a
              target="_blank"
              disabled={true}
              href={`/assets/${assetId}/${slug}/${WELLHUB_PAGE_MAP.jobSettings}`}
              rel="noopener noreferrer"
              className={classes.link}
            >
              Go to Job Settings
            </a>
          </Tooltip>
        </div>
      )}
      <div>
        {GOALS_LIST.map(goal => {
          const colorKey = getGoalKey(goal.key, 'color');
          const enableKey = getGoalKey(goal.key, 'enabled');
          const color = goalSettings[colorKey] || goal.color;
          const enabled = goalSettings[enableKey] ?? true;

          return (
            <div key={goal.key} className={classes.row}>
              <SwitchControl
                color="primary"
                checked={enabled}
                onChange={e => handleChange(enableKey, e.target.checked)}
                size="medium"
                className={classes.switch}
                rightLabel={goal.name}
              />
              <ColorPicker
                label={''}
                labelPosition="left"
                value={color}
                onChange={color => handleChange(colorKey, color)}
                lensColor={isLight(color) ? '#212121' : '#FFFFFF'}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

AppSettings.propTypes = {
  app: PropTypes.shape({}).isRequired,
  appData: PropTypes.shape().isRequired,
  company: PropTypes.shape({}),
  onSettingChange: PropTypes.func.isRequired,
  settings: PropTypes.shape().isRequired,
  user: PropTypes.shape({}),
};

AppSettings.defaultProps = {
  user: {},
  company: {},
};

// Important: Do not change root component default export (AppSettings.js). Use it as container
//  for your App Settings. It's required to make build and zip scripts work as expected;
export default AppSettings;
