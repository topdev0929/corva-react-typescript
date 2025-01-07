import { Toolbar, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    '&.MuiToolbar-gutters': {
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
  highlight: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(3, 188, 212, 0.2)',
  },
  numSelected: {
    fontSize: 14,
  },
});

const TableToolbar = ({ numSelected, actions, content, classes, ...ToolbarProps }) => {
  const styles = useStyles();

  return (
    <Toolbar
      classes={classes}
      className={classNames(styles.root, classes?.root, {
        [styles.highlight]: numSelected > 0,
      })}
      variant="dense"
      {...ToolbarProps}
    >
      {numSelected > 0 ? (
        <>
          <div className={styles.numSelected}>{numSelected} selected</div>
          <div>{actions}</div>
        </>
      ) : (
        <>{content}</>
      )}
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number,
  actions: PropTypes.node,
  content: PropTypes.node,
};

TableToolbar.defaultProps = {
  numSelected: PropTypes.number,
  actions: null,
  content: null,
};

export default TableToolbar;
