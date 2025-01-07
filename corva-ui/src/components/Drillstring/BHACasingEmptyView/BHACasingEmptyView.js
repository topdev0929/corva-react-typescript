import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  noComponentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  noComponentTitle: {
    fontSize: '24px',
    fontStyle: 'italic',
    fontWeight: 400,
    color: theme.palette.primary.text7,
  },
  secondLines: {
    display: 'flex',
    flexDirection: 'row',
  },
  addComponentTitle: {
    fontSize: '14px',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  secondLineTitle: {
    fontSize: '14px',
    color: theme.palette.primary.text7,
  },
}));

function BHACasingEmptyView({ type, onAdd }) {
  const styles = useStyles();

  return (
    <div className={styles.noComponentWrapper}>
      <span className={styles.noComponentTitle}>No Components</span>
      <div className={styles.secondLines}>
        <span className={styles.addComponentTitle} onClick={onAdd}>
          Add Component
        </span>
        <span className={styles.secondLineTitle}>&nbsp;to build {type}</span>
      </div>
    </div>
  );
}

BHACasingEmptyView.propTypes = {
  type: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default BHACasingEmptyView;
