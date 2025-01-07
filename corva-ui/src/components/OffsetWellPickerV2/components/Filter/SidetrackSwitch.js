import { useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { withStyles } from '@material-ui/core';
import { SwitchControl } from '~/components';

const muiStyles = {
  formControl: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '56px',
  },
};

const debouncedFunc = debounce(callback => {
  callback();
}, 500);

function SidetrackSwitch({ initialChecked, onChange, classes, 'data-testid': dataTestId }) {
  const [switchChecked, setSwichtChecked] = useState(initialChecked);
  const handleChangeValue = e => {
    setSwichtChecked(e.target.checked);
    debouncedFunc(() => {
      onChange(e.target.checked);
    });
  };

  return (
    <SwitchControl
      data-testid={dataTestId}
      rightLabel="Exclude Sidetracks"
      color="primary"
      checked={switchChecked}
      onChange={handleChangeValue}
      size="small"
      className={classes.formControl}
    />
  );
}

SidetrackSwitch.propTypes = {
  initialChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  'data-testid': PropTypes.string,
};

SidetrackSwitch.defaultProps = {
  'data-testid': 'SidetrackSwitch',
};

export default withStyles(muiStyles)(SidetrackSwitch);
