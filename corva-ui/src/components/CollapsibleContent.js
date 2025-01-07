import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';

const MIN_STEP_TO_MAKE_ITEM_COLLAPSABLE = 40;
const BLACKOUT_HEIGHT = 40;

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    position: 'relative',
  },
  content: {
    overflow: 'hidden',
  },
  readMore: {
    height: 40,
    display: 'block',
    textAlign: 'right',
  },
  blackOut: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'flex-end',
    background: `linear-gradient(to bottom, transparent, ${theme.palette.background.paper})`,
    height: BLACKOUT_HEIGHT,
    marginTop: -BLACKOUT_HEIGHT,
  },
}));

const CollapsibleContent = ({ maxHeight, children }) => {
  const classes = useStyles();
  const [collapsible, setCollapsible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const contentRef = useRef();

  const setCollapsingStatus = () => {
    const collapsible =
      maxHeight && contentRef.current.clientHeight > maxHeight + MIN_STEP_TO_MAKE_ITEM_COLLAPSABLE;

    setCollapsed(collapsible);
    setCollapsible(collapsible);
  };

  const toggleCollapse = () => {
    setCollapsed(collapsed => !collapsed);
    if (collapsed && window.innerHeight < contentRef.current.clientHeight) {
      contentRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    setCollapsingStatus();
  }, [children]);

  return (
    <div className={classes.contentWrapper}>
      <div className={classes.content} style={{ maxHeight: collapsed ? maxHeight : 'initial' }}>
        <div ref={contentRef}>{children}</div>
      </div>
      {collapsible && (
        <div className={classes.readMore}>
          {collapsed && <div className={classes.blackOut} />}
          <Button onClick={toggleCollapse}>
            {collapsed ? <>Read more &hellip;</> : 'Show less'}
          </Button>
        </div>
      )}
    </div>
  );
};

CollapsibleContent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  maxHeight: PropTypes.number,
};

CollapsibleContent.defaultProps = {
  maxHeight: 120,
};

export default CollapsibleContent;
