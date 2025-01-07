import { useContext, useMemo, useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { noop } from 'lodash';
import PropTypes from 'prop-types';

import AppContext from '~/components/DevCenter/AppContext';
import { usePermissionsContext } from '~/permissions';

import { devcenter as devCenterUtils, getUserUnits, subscribeForUserUnitsUpdates } from '~/utils';
import { DevCenterAppContainer } from '~/components';

import { DevCenterAppZoidComponent, APP_IFRAME_ATTRIBUTE } from './DevCenterAppZoidComponent';
import { ISOLATED_PAGE_APP_CONTAINER_ID } from './constants';

import styles from './DevCenterIsolatedApp.module.css';

const PAGE_NAME = 'DevCenter_AppContainer';

function DevCenterIsolatedAppComponent({
  isIsolationFeatureEnabled,
  onAppFullscreenTransparentMode,
  onIsMaximizedChange,
  onInnerContainerMouseEnter,
  onInnerContainerMouseLeave,
  onAppContainerClick,
  setInnerContainerRefFn,
  ...props
}) {
  const devCenterRouter = useMemo(
    () => devCenterUtils.createDevCenterRouter(props.router),
    [props.router?.location]
  );
  const DCAppComponent = isIsolationFeatureEnabled
    ? DevCenterAppZoidComponent
    : DevCenterAppContainer;

  const appIframeDocument = useRef();
  const containerRef = useRef();
  const fixedSizeContainerRef = useRef();
  const modalModeRef = useRef(false);

  const isAppMaximized = devCenterUtils.isAppMaximized(props.router?.location?.query, props.app.id);

  const [userUnits, setUserUnits] = useState(getUserUnits());

  useEffect(() => {
    const unsubscribeFn = subscribeForUserUnitsUpdates(newUserUnits => setUserUnits(newUserUnits));

    return () => unsubscribeFn();
  }, []);

  const appContextValue = useContext(AppContext);
  const permissionsContextValue = usePermissionsContext();

  /*
  What is fullscreen modal mode?

  Our apps, are shown in isolated iFrames. Because of it, when an app has some modal
  and opens it - it's opened inside of its iframe, instead of opening at the center of the screen.

  To make app modals & other elements be opened at the center of the screen, as if they are not inside of an iframe,
  we use some hacks.

  When the app wants to open a fullscreen element, we make its iframe fullscreen, but with transparent background,
  and we set width/height & position of that app iframe to inner app container that is located inside of the iframe.
  So when iframe's fullscreen element is opened, it looks like it's a part of the platform, and the app which shows the element, looks like
  usual, not in fullscreen

  So the platform provides this setIsFullscreenModalMode function to DC apps.
  When DC app wants to open a modal that should be opened at the center of the screen - it needs to
  call setIsFullscreenModalMode(true) first. And when it closes the modal - setIsFullscreenModalMode(false)

  Two things are important about this
  - all these styles that make this invisible background work should be applied at once
  - enter and exit from the mode, shouldn't trigger even a single re-render, as it may impact
    some elements inside the DC app
  */

  function handleAppFullscreenTransparentModeExit() {
    onAppFullscreenTransparentMode({ appId: props.app.id, isModeEnabled: false });
    document.body.classList.remove('dc-isolated-app__body-overflow', styles.compensateScroll);
  }

  function setIsFullscreenModalMode(nextIsFullscreenModalModeValue) {
    // When an app is already in fullscreen mode, no need to use this
    // invisible fullscreen mode to make elements take the whole screen
    if (
      !isIsolationFeatureEnabled ||
      isAppMaximized ||
      modalModeRef.current === nextIsFullscreenModalModeValue
    ) {
      return;
    }

    const classesEditMethod = nextIsFullscreenModalModeValue ? 'add' : 'remove';

    containerRef.current?.classList[classesEditMethod](styles.containerMaximizedTransparent);

    appIframeDocument.current = containerRef.current?.querySelector(
      `[${APP_IFRAME_ATTRIBUTE}]`
    )?.contentWindow?.document;

    const isolatedPageAppContainer = appIframeDocument.current?.getElementById(
      ISOLATED_PAGE_APP_CONTAINER_ID
    );

    if (!isolatedPageAppContainer) {
      return;
    }

    if (nextIsFullscreenModalModeValue) {
      const { top, left, width, height } = fixedSizeContainerRef.current.getBoundingClientRect();

      // We need to directly set inner iFrame container sizes together with DC platform styles
      // as passing this as props and using some effect inside of an iframe
      // results in a slight delay, which looks like a quick layout jump
      isolatedPageAppContainer.setAttribute(
        'style',
        `
        top: ${top}px;
        left: ${left}px;
        width: ${width}px;
        height: ${height}px;
        position: absolute;
      `
      );
      onAppFullscreenTransparentMode({ appId: props.app.id, isModeEnabled: true });
      const isBodyScrollVisible = window.innerWidth !== document.body.clientWidth;
      document.body.classList.add(
        'dc-isolated-app__body-overflow',
        isBodyScrollVisible && styles.compensateScroll
      );
    } else {
      isolatedPageAppContainer.setAttribute('style', '');
      handleAppFullscreenTransparentModeExit();
    }
    modalModeRef.current = nextIsFullscreenModalModeValue;
  }

  useEffect(() => {
    return handleAppFullscreenTransparentModeExit;
  }, []);

  /**
   * This should be the same function as calling react-intersection-observer's ref setter actually triggers re-render.
   * Which in its turn causes infinite re-render loop.
   */
  const setContainerRefs = useCallback(node => {
    containerRef.current = node;
    setInnerContainerRefFn(node);
  }, []);

  return (
    <div
      className={classNames('dc-isolated-app', styles.fixedSizeContainer)}
      ref={fixedSizeContainerRef}
    >
      <div
        ref={setContainerRefs}
        onMouseEnter={onInnerContainerMouseEnter}
        onMouseLeave={onInnerContainerMouseLeave}
        data-testid={`${PAGE_NAME}_${props.app.app.name}`}
        className={classNames(styles.container, isAppMaximized && styles.containerMaximized)}
      >
        <DCAppComponent
          {...props}
          appContextValue={appContextValue}
          devCenterRouter={devCenterRouter}
          globalNotificationToastsAPI={window[Symbol.for('notificationToasts')]}
          onAppContainerClick={onAppContainerClick}
          onIsMaximizedChange={onIsMaximizedChange}
          permissionsContextValue={permissionsContextValue}
          setIsFullscreenModalMode={setIsFullscreenModalMode}
          userUnits={userUnits}
        />
      </div>
    </div>
  );
}

DevCenterIsolatedAppComponent.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.number,
    app: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  isIsolationFeatureEnabled: PropTypes.func,
  onAppContainerClick: PropTypes.func,
  onAppFullscreenTransparentMode: PropTypes.func,
  onAppRemove: PropTypes.func,
  onInnerContainerMouseEnter: PropTypes.func,
  onInnerContainerMouseLeave: PropTypes.func,
  onIsMaximizedChange: PropTypes.func,
  onSettingChange: PropTypes.func,
  onSettingsChange: PropTypes.func,
  setInnerContainerRefFn: PropTypes.func,
  updateCurrentDashboardAppLastAnnotation: PropTypes.func,
};

DevCenterIsolatedAppComponent.defaultProps = {
  isIsolationFeatureEnabled: false,
  onAppContainerClick: noop,
  onAppFullscreenTransparentMode: noop,
  onAppRemove: noop,
  onInnerContainerMouseEnter: noop,
  onInnerContainerMouseLeave: noop,
  onIsMaximizedChange: noop,
  onSettingChange: noop,
  onSettingsChange: noop,
  setInnerContainerRefFn: noop,
  updateCurrentDashboardAppLastAnnotation: noop,
};

export const DevCenterIsolatedApp = withRouter(DevCenterIsolatedAppComponent);
