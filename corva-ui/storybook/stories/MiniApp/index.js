import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { darkTheme } from '~/config/theme';

import './MiniApp.css';

function MiniApp(props) {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <div className="storybook-miniapp">
        <div className="storybook-miniapp-container">{props.children}</div>
      </div>
    </MuiThemeProvider>
  );
}

MiniApp.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MiniApp;
