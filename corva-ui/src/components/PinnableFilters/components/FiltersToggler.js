import PropTypes from 'prop-types';
import SortIcon from '@material-ui/icons/Sort';
import { withStyles } from '@material-ui/core/styles';
import Button from '~/components/Button';

const muiStyles = theme => ({
  button: {
    ...(theme.isLightTheme ? { color: 'black'}  : {}),

    marginRight: theme.spacing(),
  },
});

function FiltersToggler({ onClick, classes }) {
  return (
    <div onClick={onClick}>
      <Button className={classes.button} startIcon={<SortIcon />}>
        Filters
      </Button>
    </div>
  );
}

FiltersToggler.propTypes = {
  onClick: PropTypes.func.isRequired,
};
export default withStyles(muiStyles)(FiltersToggler);
