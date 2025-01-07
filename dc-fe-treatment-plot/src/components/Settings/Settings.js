import PropTypes from 'prop-types';

import SideSetting from './SideSetting';

function Settings(props) {
  const viewMode = props.setting.viewMode;

  return (
    <SideSetting
      isOverlayMode={viewMode === 'overlay'}
      setting={props.sideSetting}
      onSettingChange={props.onSettingChange}
    />
  );
}

Settings.propTypes = {
  setting: PropTypes.shape({
    viewMode: PropTypes.string,
  }).isRequired,
  sideSetting: PropTypes.shape({}).isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default Settings;
