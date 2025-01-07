import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { makeStyles } from '@material-ui/core';
import { SwitchControl } from '~/components';

const useStyles = makeStyles({
  formControl: {
    width: ({ isMobile }) => (isMobile ? '200px' : '150px'),
  },
  root: {
    marginLeft: '-10px',
  },
  label: {
    width: ({ isMobile }) =>!isMobile && '66px',
  },
});

const debouncedFunc = debounce(callback => {
  callback();
}, 500);

function SidetrackSwitch({ checked, onChange, isMobile }) {
  const classes = useStyles({ isMobile });
  const [isSwitchChecked, setIsSwitchChecked] = useState(checked);
  useEffect(() => {
    setIsSwitchChecked(checked);
  }, [checked]);

  const handleChangeValue = e => {
    setIsSwitchChecked(e.target.checked);
    debouncedFunc(() => {
      onChange(e.target.checked);
    });
  };

  return (
    <SwitchControl
      rightLabel="Exclude Sidetracks"
      color="primary"
      checked={isSwitchChecked}
      onChange={handleChangeValue}
      size="small"
      className={classes.formControl}
      classes={{ root: classes.root, label: classes.label }}
    />
  );
}

SidetrackSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default SidetrackSwitch;
