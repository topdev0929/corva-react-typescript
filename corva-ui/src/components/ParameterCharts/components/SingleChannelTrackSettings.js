import PropTypes from 'prop-types';

import TraceSelect from './TraceSelect';

import { DEFAULT_TRACE_SETTINGS } from '../constants';

const SingleChannelTrackSettings = ({ trackSettings, onChange, mapping }) => {
  const onChannelChange = val => {
    const mappingEntity = mapping.find(item => item.key === val);
    onChange('traces', [{ ...DEFAULT_TRACE_SETTINGS, key: val, id: val, ...mappingEntity }]);
  };

  return (
    <TraceSelect
      value={trackSettings.traces?.[0]?.key}
      onChange={onChannelChange}
      mapping={mapping}
      showLabel
    />
  );
};

SingleChannelTrackSettings.propTypes = {
  trackSettings: PropTypes.shape({
    traces: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
    })),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  mapping: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default SingleChannelTrackSettings;
