// This component has been copy-pasted from MUI documentation
// https://github.com/mui-org/material-ui/blob/master/docs/src/modules/components/AppTableOfContents.js

import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { throttle, noop } from 'lodash';
import classNames from 'classnames';
import { makeStyles, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    top: 70,
    width: 175,
    flexShrink: 0,
    position: 'sticky',
    height: 'calc(100vh - 70px)',
    overflowY: 'auto',
    padding: theme.spacing(2, 0),
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  title: {
    color: theme.palette.primary.text8,
    margin: '0 0 8px 16px',
    lineHeight: '24px',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: 1,
  },
  contents: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  ul: {
    padding: 0,
    margin: 0,
    listStyle: 'none',
    borderLeft: `1px solid ${theme.palette.background.b9}`,
  },
  li: { display: 'flex', '&:not(:first-of-type)': { marginTop: 8 } },
  item: {
    color: theme.palette.primary.text6,
    display: 'inline-block',
    margin: '7px 16px',
    fontSize: 12,
    fontWeight: 400,
    letter: '0.4px',
    lineHeight: '16px',
  },
  active: { color: theme.palette.text.primary, fontWeight: 500 },
  activeItemBorder: {
    height: 30,
    width: '2px',
    backgroundColor: '#03BCD4',
    borderRadius: '0 2px 2px 0',
    position: 'absolute',
  },
}));

// TODO: these nodes are mutable sources. Use createMutableSource once it's stable
function getItemsClient(headings) {
  return headings.map(item => ({ ...item, node: document.getElementById(item.hash) }));
}

function useThrottledOnScroll(callback, delay) {
  const throttledCallback = useMemo(
    () => (callback ? throttle(callback, delay) : noop),
    [callback, delay]
  );

  useEffect(() => {
    if (throttledCallback === noop) return undefined;
    window.addEventListener('scroll', throttledCallback);

    return () => {
      window.removeEventListener('scroll', throttledCallback);
      throttledCallback.cancel();
    };
  }, [throttledCallback]);
}

function AnchorsList(props) {
  const { title, items } = props;
  const classes = useStyles();

  const itemsWithNodeRef = useRef([]);
  useEffect(() => {
    itemsWithNodeRef.current = getItemsClient(items);
  }, [items]);

  const [activeState, setActiveState] = useState(null);
  const clickedRef = useRef(false);
  const unsetClickedRef = useRef(null);
  const findActiveIndex = useCallback(() => {
    // Don't set the active index based on scroll if a link was just clicked
    if (clickedRef.current) return;

    let active;
    for (let i = itemsWithNodeRef.current.length - 1; i >= 0; i -= 1) {
      // No hash if we're near the top of the page
      if (document.documentElement.scrollTop < 100) {
        active = { hash: null };
        break;
      }

      const item = itemsWithNodeRef.current[i];

      if (
        item.node &&
        item.node.offsetTop <
          document.documentElement.scrollTop + document.documentElement.clientHeight / 8
      ) {
        active = item;
        break;
      }
    }
    if (active && activeState !== active.hash) setActiveState(active.hash);
  }, [activeState]);

  // Corresponds to 10 frames at 60 Hz
  useThrottledOnScroll(items.length > 0 ? findActiveIndex : null, 166);

  const handleClick = hash => event => {
    // Ignore click for new tab/new window behavior
    if (
      event.defaultPrevented ||
      event.button !== 0 || // ignore everything but left-click
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return;
    }

    // Used to disable findActiveIndex if the page scrolls due to a click
    clickedRef.current = true;
    unsetClickedRef.current = setTimeout(() => {
      clickedRef.current = false;
    }, 1000);

    if (activeState !== hash) {
      setActiveState(hash);
    }
  };

  useEffect(
    () => () => {
      clearTimeout(unsetClickedRef.current);
    },
    []
  );

  useEffect(() => {
    // Fires after component has been mounted. We need this to scroll to anchor on initial load
    const { hash } = window.location;
    if (!hash) return;
    const element = document.getElementById(hash.substr(1));
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      }, 50);
    }
  }, []);

  return (
    <nav className={classes.root} data-testid='anchors-list'>
      {items.length > 0 && (
        <>
          <div className={classes.title}>{title}</div>
          <Typography component="ul" className={classes.ul}>
            {items.map(item => {
              const isActive = activeState === item.hash;

              return (
                <li key={item.text} className={classes.li}>
                  {isActive && <div className={classes.activeItemBorder} />}
                  <Link
                    display="block"
                    href={`#${item.hash}`}
                    underline="none"
                    onClick={handleClick(item.hash)}
                    className={classNames(classes.item, isActive && classes.active)}
                    data-testid={`anchor-item-${item.hash}`}
                  >
                    <span>{item.text}</span>
                  </Link>
                </li>
              );
            })}
          </Typography>
        </>
      )}
    </nav>
  );
}

AnchorsList.defaultProps = {
  title: 'ON THIS PAGE',
  items: [],
};

AnchorsList.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({ hash: PropTypes.string, text: PropTypes.string })),
};

export default AnchorsList;
