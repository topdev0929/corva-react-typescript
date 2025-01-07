import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import { getUnitDisplay } from '~/utils';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    width: '100%',
    position: 'sticky',
    top: 0,
    background: theme.palette.background.b5,
    zIndex: 2,
  },
  headCell: {
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    padding: '8px 0px 8px 8px',
    borderTop: `1px solid ${theme.palette.background.b8}`,
    borderBottom: `1px solid ${theme.palette.background.b8}`,
    background: theme.palette.background.b5,
    color: theme.palette.primary.text7,
    fontSize: '12px',
  },
  componentCell: {
    width: 'calc(40px + (100% - 120px) / 5)',
  },
  ratioWidth: {
    width: 'calc((100% - 120px) / 5)',
  },
  actionCell: {
    justifyContent: 'flex-end',
    width: '80px',
    minWidth: '80px',
    paddingRight: '8px',
  },
}));

function Header() {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <div className={classNames(classes.headCell, classes.componentCell)}>Component</div>
      <div className={classNames(classes.headCell, classes.ratioWidth)}>
        OD ({getUnitDisplay('shortLength')})
      </div>
      <div className={classNames(classes.headCell, classes.ratioWidth)}>
        ID ({getUnitDisplay('shortLength')})
      </div>
      <div className={classNames(classes.headCell, classes.ratioWidth)}>
        Linear Weight ({getUnitDisplay('massPerLength')})
      </div>
      <div className={classNames(classes.headCell, classes.ratioWidth)}>
        Length ({getUnitDisplay('length')})
      </div>
      <div className={classNames(classes.headCell, classes.actionCell)}>Action</div>
    </div>
  );
}

export default Header;
