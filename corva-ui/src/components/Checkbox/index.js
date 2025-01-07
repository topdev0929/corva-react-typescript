import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Checkbox as MuiCheckbox, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  small: {
    padding: 5,
  },
});

const Checkbox = props => {
  const { size, classes = {} } = props;
  const styles = useStyles();

  if (size === 'medium') {
    return <MuiCheckbox {...props} />;
  }

  return (
    <MuiCheckbox
      {...props}
      classes={{
        ...classes,
        root: classNames(styles.small, classes.root),
      }}
    />
  );
};

Checkbox.propTypes = {
  size: PropTypes.string,
};

Checkbox.defaultProps = {
  size: 'medium',
};

export default Checkbox;
