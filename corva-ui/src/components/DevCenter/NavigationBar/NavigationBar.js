import PropTypes from 'prop-types';
import classnames from 'classnames';

import { AppBar, Toolbar, withStyles, Grid } from '@material-ui/core';

const NavigationBar = ({ classes, appBarClassName, children }) => (
  <AppBar className={classnames(classes.appBar, appBarClassName)} position="fixed">
    <Toolbar className={classes.toolbar}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.container}
      >
        {children}
      </Grid>
    </Toolbar>
  </AppBar>
);

NavigationBar.propTypes = {
  children: PropTypes.node.isRequired,
  appBarClassName: PropTypes.string,
};

NavigationBar.defaultProps = {
  appBarClassName: null,
};

export default withStyles(theme => ({
  appBar: {
    height: 50,
    zIndex: theme.zIndex.drawer + 1,
    background: 'linear-gradient(86.1deg, #2C2C2C 39.4%, #3B3B3B 74.22%)',
  },
  toolbar: {
    minHeight: 50,
    height: '100%',
  },
  container: {
    height: '100%',
  },
}))(NavigationBar);
