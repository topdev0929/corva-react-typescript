import { Component } from 'react';
import PropTypes from 'prop-types';
import { Context as RollbarContext, getRollbarFromContext } from '@rollbar/react';

import DevCenterAppErrorView from './DevCenterAppErrorView';

class ErrorBoundary extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = { hasInternalError: false };

  static getDerivedStateFromError() {
    return { hasInternalError: true };
  }

  componentDidCatch(error) {
    this.setState({ hasInternalError: true });
    console.error(error);

    const rollbar = getRollbarFromContext(this.context || {});

    if (rollbar && rollbar.options.accessToken) {
      rollbar.error(error);
    }
  }

  render() {
    if (!this.state.hasInternalError) return this.props.children;
    const { ErrorView, children, ...errorViewProps } = this.props;
    return <ErrorView {...errorViewProps} />;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  ErrorView: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  ErrorView: DevCenterAppErrorView,
};

ErrorBoundary.contextType = RollbarContext;

export default ErrorBoundary;
