import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import EditableItem from '../EditableItem';

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',

  },
  isSelected: {
    '& > div': {
      color: '#FFFFFF',
    },
    backgroundColor: 'rgba(3, 188, 212, 0.15)  !important',
    '&::before': {
      height: '100%',
      width: 4,
      backgroundColor: theme.palette.primary.main,
      position: 'absolute',
      content: '""',
      borderRadius: '4px 0 0 4px',
      zIndex: 1,
    },
  },
}));

const EditableItemWithBadge = props => {
  const { isSelected } = props;
  const classes = useStyles();

  return (
    <EditableItem {...props} className={isSelected ? classes.isSelected : classes.root} />
  );
}

EditableItemWithBadge.propTypes = {
  isSelected: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

EditableItemWithBadge.defaultProps = {
  isSelected: false,
};

export default EditableItemWithBadge;
