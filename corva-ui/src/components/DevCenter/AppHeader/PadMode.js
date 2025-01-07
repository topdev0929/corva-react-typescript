import { get, isEmpty, noop } from 'lodash';
import PropTypes from 'prop-types';

import PadModeSelect from '~/components/PadModeSelect';
import { COMPLETION_APP_TYPES } from '~/constants/completion';
import { getAssetKey, getDefaultPadModeSetting } from '~/utils/completion';

const PadMode = ({
  fracFleet,
  wells,
  well,
  onSettingChange,
  appSettings,
  completionAppType,
  disableActiveWellsInPadSelect,
}) => {
  if (well || (!wells && !fracFleet)) return null;

  // use COMPLETION_APP_TYPES.fracMultiWellApp as a default if not defined in app;
  // this will be moved to the Apps Wizard soon
  // https://corvaqa.atlassian.net/browse/DC-1317

  const { padId } = appSettings;

  const appType = completionAppType || COMPLETION_APP_TYPES.fracMultiWellApp;
  const assetKey = getAssetKey(fracFleet, well, padId);
  const currentPadModeSetting = get(appSettings, ['settingsByAsset', assetKey]);

  const padModeSetting = !isEmpty(currentPadModeSetting)
    ? currentPadModeSetting
    : getDefaultPadModeSetting(fracFleet, well, appType);

  return (
    <PadModeSelect
      assets={wells}
      completionAppType={appType}
      disableActiveWellsInPadSelect={disableActiveWellsInPadSelect}
      padModeSetting={padModeSetting}
      onChange={newPadModeSetting =>
        onSettingChange('settingsByAsset', {
          ...get(appSettings, 'settingsByAsset', {}),
          [assetKey]: newPadModeSetting,
        })
      }
    />
  );
};

PadMode.propTypes = {
  appSettings: PropTypes.shape({
    padId: PropTypes.number,
  }),
  completionAppType: PropTypes.string,
  fracFleet: PropTypes.shape({}),
  onSettingChange: PropTypes.func,
  well: PropTypes.shape({}),
  wells: PropTypes.arrayOf(PropTypes.shape()),
};

PadMode.defaultProps = {
  appSettings: {},
  completionAppType: undefined,
  fracFleet: undefined,
  onSettingChange: noop,
  well: undefined,
  wells: undefined,
};

export default PadMode;
