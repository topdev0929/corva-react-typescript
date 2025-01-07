import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';

import { Box, Drawer, Tooltip, makeStyles, createStyles } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import SortIcon from '@material-ui/icons/Sort';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import IconButton from '~/components/IconButton';
import Button from '~/components/Button';

const PAGE_NAME = 'AppSideBar';

const OPEN_CLASSNAME = 'open';
const CLOSED_CLASSNAME = 'closed';
const WITH_SHADOW_CLASSNAME = 'withShadow';

type Anchor = 'left' | 'right';
type makeStylesProps = { openedDrawerWidth: string | number; anchor: Anchor; };
export interface AppSideBarProps extends PropTypes.InferProps<typeof appSideBarPropTypes> {
  anchor: Anchor;
}

const useStyles = makeStyles(theme => createStyles({
  drawer: ({ openedDrawerWidth }: makeStylesProps) => ({
    height: '100%',
    position: 'relative',
    width: openedDrawerWidth,
    borderTop: '1px solid',
    borderTopColor: theme.palette.background.b7,
    boxShadow: '4px 0px 8px rgba(0, 0, 0, 0.15)',
    [`&.${CLOSED_CLASSNAME}`]: {
      width: '48px',
    },
  }),
  drawerPaper: {
    position: 'relative',
    width: '100%',
    backgroundColor: theme.palette.background.b5,
    [`&.${CLOSED_CLASSNAME}`]: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.background.b7,
        '& > $header': {
          backgroundColor: theme.palette.background.b7,
        },
      },
    },
    '&.MuiDrawer-paperAnchorDockedLeft': {
      borderRight: 'none',
    },
    '&.MuiDrawer-paperAnchorDockedRight': {
      borderLeft: 'none',
    },
  },
  header: {
    height: 48,
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.background.b7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    backgroundColor: theme.palette.background.b5,
    [`&.${OPEN_CLASSNAME}`]: {
      padding: theme.spacing(1.5),
      justifyContent: 'flex-start',
    },
    [`&.${WITH_SHADOW_CLASSNAME}`]: {
      zIndex: 1,
      boxShadow: '-18px 12px 12px #272727',
    },
  },
  openToggleIconOpen: {
    transform: 'rotate(180deg)',
  },
  openToggleContainer: ({ anchor }: makeStylesProps) => ({
    alignItems: 'center',
    bottom: 0,
    display: 'flex',
    flex: '0 0',
    height: 48,
    justifyContent: 'center',
    padding: 6,
    position: 'absolute',
    width: '100%',
    [`&.${WITH_SHADOW_CLASSNAME}`]: {
      zIndex: 1,
      boxShadow: '-18px -12px 12px #272727',
    },
    [`&.${OPEN_CLASSNAME}`]: {
      justifyContent: anchor === 'left' ? 'flex-end' : 'flex-start',
      paddingRight: 6,
    },
  }),
  contentWrapper: {
    marginTop: 48,
    height: 'calc(100% - 96px)', // NOTE: 48px - height of header
    overflowY: 'auto',
  },
  content: {
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
  },
  selectAllButton: {
    textTransform: 'none',
    fontSize: '10px',
    lineHeight: '14px',
    letterSpacing: '0.4px',
    marginLeft: 16,
    '& .MuiButton-iconSizeMedium > *:first-child': {
      fontSize: '12px !important',
    },
    '& .MuiButton-startIcon': {
      marginRight: 4,
    },
  },
  headerIcon: {
    cursor: 'pointer',
  },
  headerIconText: {
    cursor: 'pointer',
    paddingLeft: 7,
    letterSpacing: 1,
  },
}));

const AppSideBar = ({
  anchor,
  children,
  drawerPaperClassName,
  expandedTooltipTitle,
  collapsedTooltipTitle,
  header,
  headerIcon,
  headerTitleIcon,
  isOpen,
  openedDrawerWidth,
  setIsOpen,
  size,
  allOptionsButtonShown,
  isAllOptionsSelected,
  onAllOptionsClick,
}: AppSideBarProps): JSX.Element => {
  const [isScrollable, setIsScrollable] = useState(false);
  const contentRef = useRef<HTMLDivElement>();

  const styles = useStyles({
    anchor,
    openedDrawerWidth: openedDrawerWidth || { small: 235, medium: 354, large: 473 }[size],
  });

  useEffect(() => {
    const { scrollHeight, clientHeight } = contentRef.current;
    setIsScrollable(scrollHeight > clientHeight);
  });

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const onSidebarClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const onHeaderClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const allOptionsClickHandler = e => {
    e.stopPropagation();
    onAllOptionsClick(e);
  };

  const ChevroneIcon = anchor === 'left' ? ChevronRightRoundedIcon : ChevronLeftRoundedIcon;

  return (
    <Drawer
      data-testid={`${PAGE_NAME}_Drawer`}
      onClick={onSidebarClick}
      className={classnames(styles.drawer, !isOpen && CLOSED_CLASSNAME)}
      variant="permanent"
      classes={{
        paper: classnames(styles.drawerPaper, drawerPaperClassName, !isOpen && CLOSED_CLASSNAME),
      }}
      anchor={anchor as Anchor}
    >
      <div
        className={classnames(
          styles.header,
          isOpen && OPEN_CLASSNAME,
          isScrollable && WITH_SHADOW_CLASSNAME
        )}
        onClick={onHeaderClick}
      >
        {isOpen && (
          <>
            {headerTitleIcon || <SortIcon className={styles.headerIcon} />}
            <div data-testid={`${PAGE_NAME}_header`} className={styles.headerIconText}>{header}</div>
            {allOptionsButtonShown && (
              <Button
                className={styles.selectAllButton}
                onClick={allOptionsClickHandler}
                startIcon={isAllOptionsSelected ? <CloseIcon /> : <CheckIcon />}
              >
                {isAllOptionsSelected ? 'Clear All' : 'Select All'}
              </Button>
            )}
          </>
        )}
        {!isOpen && headerIcon}
      </div>
      <div className={styles.contentWrapper} ref={contentRef}>
        <div className={styles.content}>{isOpen && children}</div>
      </div>
      <Box
        className={classnames(styles.openToggleContainer, {
          [OPEN_CLASSNAME]: isOpen,
          [WITH_SHADOW_CLASSNAME]: isScrollable,
        })}
      >
        <Tooltip title={isOpen ? expandedTooltipTitle : collapsedTooltipTitle} placement="bottom">
          <div>
            <IconButton aria-label="toggle sidebar" onClick={toggleIsOpen}>
              <ChevroneIcon
                data-testid={`${PAGE_NAME}_arrowButton`}
                className={classnames(isOpen && styles.openToggleIconOpen)}
              />
            </IconButton>
          </div>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

const appSideBarPropTypes = {
  anchor: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node.isRequired,
  drawerPaperClassName: PropTypes.string,
  expandedTooltipTitle: PropTypes.string,
  collapsedTooltipTitle: PropTypes.string,
  header: PropTypes.node,
  headerIcon: PropTypes.node,
  headerTitleIcon: PropTypes.node,
  isOpen: PropTypes.bool,
  openedDrawerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setIsOpen: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  allOptionsButtonShown: PropTypes.bool,
  isAllOptionsSelected: PropTypes.bool,
  onAllOptionsClick: PropTypes.func,
};

AppSideBar.propTypes = appSideBarPropTypes;

AppSideBar.defaultProps = {
  anchor: 'left',
  drawerPaperClassName: '',
  expandedTooltipTitle: 'Collapse',
  collapsedTooltipTitle: 'Expand',
  header: null,
  headerIcon: null,
  headerTitleIcon: null,
  isOpen: false,
  openedDrawerWidth: 0,
  setIsOpen: noop,
  size: 'medium',
  allOptionsButtonShown: false,
  isAllOptionsSelected: false,
  onAllOptionsClick: noop,
};

export default AppSideBar;

// export default ({ children }) => children;
