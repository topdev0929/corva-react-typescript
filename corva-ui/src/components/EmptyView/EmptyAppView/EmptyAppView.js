// NOTE: This component is deprecated and will be removed soon in favor of DevCenterAppErrorView
// Designs: https://www.figma.com/file/Ii3zVMdSWFGRWvxHhV3NGl/Tiers?node-id=1051%3A468

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core';

import EmptyStateLarge from './images/EmptyLarge.svg';
import ErrorLarge from './images/ErrorLarge.svg';
import NoDataLarge from './images/NoDataLarge.svg';
import NoSubscriptionLarge from './images/NoSubscriptionLarge.svg';
import AppHeader from '../../DevCenter/AppHeader';

const PAGE_NAME = 'EmptyAppView';

const HEIGHT_SMALL_BREAKPOINT = 300;
const HEIGHT_MEDIUM_BREAKPOINT = 400;

export const APP_MESSAGES = {
  appNotSubscribed: {
    title: 'No Subscription exists for this app.',
    subtitle: 'Contact your Corva Account rep to get access to this app.',
  },
  appNotSubscribedForAsset: {
    title: 'No Subscription exists for this asset.',
    subtitle: 'Contact your Corva Account rep to get access to this asset.',
  },
  internalAppError: {
    title: 'App Loading Error',
  },
  appPackageWasNotFound: {
    title: 'App package was not found',
    subtitle:
      'Please choose another version in the app settings menu or delete and add app again on your dashboard',
  },
  fracFleetWasNotFound: {
    title: 'Frac fleet was not found',
  },
  fracFleetHasNoPad: {
    title: 'Frac fleet has no active pad',
  },
  padHasNoWells: {
    title: 'This pad has no wells',
  },
  appComponentWasNotFound: {
    title: 'App component was not found',
  },
  noAssetData: {
    title: 'No asset data found',
  },
};

export const EMPTY_STATES = {
  empty: 'empty',
  error: 'error',
  noData: 'noData',
  noSubscription: 'noSubscription',
};

const STATE_IMAGES = {
  [EMPTY_STATES.empty]: EmptyStateLarge,
  [EMPTY_STATES.error]: ErrorLarge,
  [EMPTY_STATES.noData]: NoDataLarge,
  [EMPTY_STATES.noSubscription]: NoSubscriptionLarge,
};

const useStyles = makeStyles(({ palette }) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 24,
    overflow: 'auto',
  },
  title: {
    color: palette.primary.text7,
    fontSize: 32,
    lineHeight: '38px',
    marginBottom: 8,
    '&.medium': { fontSize: 24, lineHeight: '28px' },
    '&.small': { fontSize: 24, lineHeight: '28px' },
    fontStyle: 'italic',
  },
  subtitle: {
    color: palette.primary.text6,
    fontSize: 16,
    lineHeight: '22px',
    marginBottom: 24,
    '&.medium': { fontSize: 14, lineHeight: '20px' },
    '&.small': { fontSize: 14, lineHeight: '20px' },
  },
  imageWrapper: {
    display: 'flex',
    flexGrow: '1',
    maxWidth: 390,
    maxHeight: 300,
    width: '100%',
    '&.medium': { maxidth: 260, maxHeight: 200 },
  },
  backgroundImage: {
    width: '100%',

    backgroundImage: props => `url(${[STATE_IMAGES[props.state]]})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  },
  appHeader: {
    display: 'flex',
    padding: '12px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  container: {
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
}));

function EmptyAppView(props) {
  const { title, subtitle, state, withAppHeader, app, actions } = props;
  const styles = useStyles({ state });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const emptyViewRef = useRef(null);

  const currentRef = emptyViewRef.current;
  const isSmallSize = currentRef?.offsetHeight < HEIGHT_SMALL_BREAKPOINT;
  const isMediumSize = currentRef?.offsetHeight < HEIGHT_MEDIUM_BREAKPOINT;

  return (
    <div className={styles.container}>
      {withAppHeader && <AppHeader app={app} classes={{ appHeader: styles.appHeader }} />}
      <div className={styles.wrapper} ref={emptyViewRef}>
        {isMounted && (
          <>
            <div
              data-testid={`${PAGE_NAME}_title`}
              className={classNames(styles.title, isMediumSize && 'medium', isSmallSize && 'small')}
            >
              {title}
            </div>
            {actions}
            {subtitle && (
              <div
                data-testid={`${PAGE_NAME}_subtitle`}
                className={classNames(
                  styles.subtitle,
                  isMediumSize && 'medium',
                  isSmallSize && 'small'
                )}
              >
                {subtitle}
              </div>
            )}
            {!isSmallSize && (
              <div className={classNames(styles.imageWrapper, isMediumSize && 'medium')}>
                <div className={styles.backgroundImage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

EmptyAppView.propTypes = {
  actions: PropTypes.node,
  app: PropTypes.shape({}),
  state: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string.isRequired,
  withAppHeader: PropTypes.bool,
};

EmptyAppView.defaultProps = {
  actions: null,
  app: undefined,
  state: EMPTY_STATES.empty,
  subtitle: '',
  withAppHeader: false,
};
EmptyAppView.APP_MESSAGES = APP_MESSAGES;
EmptyAppView.EMPTY_STATES = EMPTY_STATES;

export default EmptyAppView;
