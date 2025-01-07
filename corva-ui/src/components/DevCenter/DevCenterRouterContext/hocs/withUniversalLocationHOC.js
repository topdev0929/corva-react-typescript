import { withRouter } from 'react-router';

import { useDevCenterRouter } from '../effects/useDevCenterRouter';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withReactRouterLocation(Component) {
  function WithReactRouterLocation({ location, router, params, ...otherProps }) {
    return <Component location={location} {...otherProps} />;
  }

  WithReactRouterLocation.displayName = `withReactRouterLocation(${getDisplayName(Component)})`;

  return withRouter(WithReactRouterLocation);
}

export function withUniversalLocationHOC(Component) {
  const ComponentWithReactRouterLocation = withReactRouterLocation(Component);

  function WithUniversalLocation(props) {
    const devCenterRouter = useDevCenterRouter();

    if (devCenterRouter) {
      return <Component {...props} location={devCenterRouter.location} />;
    }

    return <ComponentWithReactRouterLocation {...props} />;
  }

  WithUniversalLocation.displayName = `WithUniversalLocationHOC(${getDisplayName(Component)})`;

  return WithUniversalLocation;
}
