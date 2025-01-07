import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { SwitchControl } from '~/components';

const muiStyles = {
  formControl: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '56px',
  },
};

function NonEngineeredWellsSwitch({
  value,
  onChange,
  classes,
  'data-testid': dataTestId,
}) {
  const handleChangeValue = e => {
    onChange(e.target.checked);
  };

  return (
    <SwitchControl
      data-testid={dataTestId}
      rightLabel="Exclude Non Engineered Wells"
      color="primary"
      checked={value}
      onChange={handleChangeValue}
      size="small"
      className={classes.formControl}
    />
  );
}

NonEngineeredWellsSwitch.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  'data-testid': PropTypes.string,
};

NonEngineeredWellsSwitch.defaultProps = {
  'data-testid': 'NonEngineeredWellsSwitch',
};

export default withStyles(muiStyles)(NonEngineeredWellsSwitch);
