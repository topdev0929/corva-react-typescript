import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { SingleSelect } from './SingleSelect';

const useStyles = makeStyles({
  wellSection: {
    width: '100%',
  },
});

export const WellSection = ({ selectedValue, wellSections, onChange }) => {
  const classes = useStyles();
  return (
    <SingleSelect
      label="Well Section"
      currentValue={selectedValue}
      options={wellSections}
      className={classes.wellSection}
      onChange={event => onChange(event.target.value)}
    />
  );
};

WellSection.propTypes = {
  selectedValue: PropTypes.string.isRequired,
  wellSections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
};
