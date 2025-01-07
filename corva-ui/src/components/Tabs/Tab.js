import { memo } from 'react';
import { Tab as MuiTab, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';

const Tab = ({ DisabledTooltipProps, ...TabProps }) => {
  if (TabProps.disabled) {
    return (
      <Tooltip title="Disabled" placement="top" {...DisabledTooltipProps}>
        {/* NOTE: span is used to trigger Tooltip */}
        <span><MuiTab {...TabProps} /></span>
      </Tooltip>
    );
  }

  return <MuiTab {...TabProps} />;
};

Tab.propTypes = {
  disabled: PropTypes.bool,
  DisabledTooltipProps: PropTypes.shape({}),
};

Tab.defaultProps = {
  disabled: false,
  DisabledTooltipProps: {},
};

export default memo(Tab);
