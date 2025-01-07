import { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { first, flatten, partition } from 'lodash';
import { MenuItem, FormControl, Select, makeStyles } from '@material-ui/core';

import { COMPLETION_MODES, DEFAULT_SUPPORTED_PAD_MODES } from '~/constants/completion';

import WellStreamActivityStatus from './WellStreamActivityStatus';
import { AssetStatus, PadMode } from './types';
import { useWellStreamActivityTypeSubscription } from './effects/useWellStreamActivityTypeSubscription';

const useStyles = makeStyles({
  selectFormControl: { maxWidth: '320px', padding: '5px 8px', marginLeft: 'auto' },
  padSelect: {
    fontSize: '14px',
    '&:before': {
      borderBottom: 0,
    },
    '&:after': {
      borderBottom: 0,
    },
    '& .MuiSelect-root': {
      alignItems: 'center',
      display: 'flex',
    },
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  menuItemName: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
  },
});

const PadModeSelect = props => {
  const { completionAppType, padModeSetting, assets, onChange, disableActiveWellsInPadSelect } =
    props;
  const [isSelectOpened, setIsSelectOpened] = useState(false);
  const currentItem = useRef();

  const classes = useStyles();

  const value =
    padModeSetting.mode === PadMode.custom
      ? `${PadMode.custom}--${first(padModeSetting.selectedAssets)}`
      : padModeSetting.mode;

  const customMenuItems = useMemo(() => {
    return assets.reduce((result, asset) => {
      return [
        ...result,
        {
          key: `${PadMode.custom}--${asset.id}`,
          label: `${asset.name}`,
          assetId: asset.asset_id,
          wellId: asset.id,
          status: asset.status,
        },
      ];
    }, []);
  }, [assets, completionAppType]);

  const menuItems = DEFAULT_SUPPORTED_PAD_MODES.concat(
    flatten(partition(customMenuItems, { status: AssetStatus.active }))
  );

  const handleChange = newValue => {
    const [mode, wellId] = newValue.split('--');

    const newPadModeSetting = {
      mode,
    };

    if (mode === PadMode.custom) {
      newPadModeSetting.mode = PadMode.custom;
      newPadModeSetting.selectedAssets = [parseInt(wellId, 10)];
    }

    onChange(newPadModeSetting);
  };

  const onSelectOpen = () => setIsSelectOpened(true);
  const onSelectClose = () => setIsSelectOpened(false);

  const isStatusShown = wellId => {
    return (
      (padModeSetting.mode === PadMode.custom &&
        +first(padModeSetting.selectedAssets) === +wellId) ||
      isSelectOpened
    );
  };

  const selectedAsset = menuItems.find(({ key }) => key === value);
  if (selectedAsset?.assetId) {
    currentItem.current = selectedAsset?.assetId;
  }

  const subData = useWellStreamActivityTypeSubscription({
    currentWellId: currentItem.current,
    isStatusShown: true,
    withSubscription: true,
  });

  return (
    <FormControl classes={{ root: classes.selectFormControl }}>
      {value && (
        <Select
          value={value}
          onChange={e => handleChange(e.target.value)}
          inputProps={{
            name: 'padModeSelect',
            id: 'pad-mode-select',
          }}
          className={classes.padSelect}
          onClose={onSelectClose}
          onOpen={onSelectOpen}
          MenuProps={{
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          }}
        >
          {menuItems.map(({ key, label, assetId, wellId, status }) => {
            const isWellStreamActivityStatusShown =
              isStatusShown(wellId) && status === AssetStatus.active;

            return (
              <MenuItem
                value={key}
                key={key}
                className={classes.menuItem}
                disabled={
                  disableActiveWellsInPadSelect &&
                  status !== AssetStatus.active &&
                  key !== COMPLETION_MODES.pad
                }
              >
                <span className={classes.menuItemName}>{label}</span>
                {isWellStreamActivityStatusShown && (
                  <WellStreamActivityStatus
                    isStatusShown={isStatusShown(wellId)}
                    currentWellId={assetId}
                    subData={currentItem.current?.assetId === key ? subData : undefined}
                  />
                )}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </FormControl>
  );
};

PadModeSelect.propTypes = {
  padModeSetting: PropTypes.shape({
    mode: PropTypes.string,
    selectedAssets: PropTypes.arrayOf(PropTypes.string),
  }),
  assets: PropTypes.arrayOf(PropTypes.shape()),
  completionAppType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

PadModeSelect.defaultProps = {
  padModeSetting: {},
  assets: [],
};

export default PadModeSelect;
