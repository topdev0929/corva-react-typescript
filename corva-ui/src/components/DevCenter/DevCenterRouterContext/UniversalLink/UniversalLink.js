import classNames from 'classnames';
import { Link as ReactRouterLink } from 'react-router';
import PropTypes from 'prop-types';

import { useDevCenterRouter } from '../effects/useDevCenterRouter';

import styles from './UniversalLink.css';

export function UniversalLink({ href, children, className, 'data-testid': dataTestId }) {
  const devCenterRouter = useDevCenterRouter();

  if (devCenterRouter) {
    return (
      // NOTE: "a" element is needed to drag chip to tab bar while clicks are handled by button onClick handler
      <a href={href || null}>
        <button
          data-testid={dataTestId}
          tabIndex="0"
          role="link"
          className={classNames(styles.buttonLink, className)}
          onClick={e => {
            e.stopPropagation();
            if (e.metaKey || e.ctrlKey) {
              window.open(href, '_blank');
            } else {
              devCenterRouter.push(href);
            }
          }}
        >
          {children}
        </button>
      </a>
    );
  }

  return (
    <ReactRouterLink data-testid={dataTestId} to={href} className={className}>
      {children}
    </ReactRouterLink>
  );
}

UniversalLink.propTypes = {
  href: PropTypes.any,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  'data-testid': PropTypes.string,
};

UniversalLink.defaultProps = {
  className: null,
  'data-testid': 'UniversalLink',
  href: null,
};
