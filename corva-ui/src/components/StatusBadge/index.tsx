import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { makeStyles, Typography, Theme } from '@material-ui/core';
import Tooltip from '~/components/Tooltip';

import { BADGE_ICON_STATUSES, WARNING, MAX_MOBILE_WIDTH, AssetData } from './constants';
import { DQStatusIcon } from './components/DQStatusIcon';
import { DQUnvalidatedContent } from './components/DQUnvalidatedContent';
import { ReportIssueModal } from './components/ReportIssueModal';
import { postReportError } from './api';

const PAGE_NAME = 'Status_badge';
const DEFAULT_TOOLTIP_MAX_HEIGHT = window.innerHeight - 212;

type MakeStylesProps = {
  isIconExist: boolean;
  isSuccessTypeIcon: boolean;
  isErrorTypeIcon: boolean;
  isIssueTypeIcon: boolean;
  maximized: boolean;
};

const useStyles = makeStyles<Theme, MakeStylesProps>(theme => ({
  statusBadgeWrapper: {
    backgroundColor: theme.palette.background.b4,
    display: 'flex',
    height: 30,
  },
  statusBadgeContent: {
    display: 'flex',
    padding: ({ isSuccessTypeIcon, isErrorTypeIcon, isIssueTypeIcon }) =>
      `12px 0 2px ${isSuccessTypeIcon || isErrorTypeIcon || isIssueTypeIcon ? 6 : 2}px`,
    whiteSpace: 'nowrap',
    width: 'calc(100% - 140px)',
  },
  text: {
    fontSize: '10px',
    lineHeight: '12px',
    alignSelf: 'center',
  },
  timestamp: {
    color: theme.palette.primary.text6,
    marginLeft: ({ isIconExist }) => isIconExist && 4,
  },
  warningMessage: {
    color: theme.palette.primary.text1,
    marginLeft: 4,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: '12px',
  },
  badgeIconWarning: { marginLeft: 8 },
  popper: {
    zIndex: ({ maximized }) => (maximized ? 500 : 1),
    '& .MuiTooltip-tooltip': {
      position: 'absolute',
      bottom: 0,
      width: 'max-content',
      transformOrigin: 'center top',
      maxWidth: 'none',
      padding: 4,
      fontSize: 12,
      boxShadow: '0px 0px 4px 2px rgb(0 0 0 / 12%)',
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: '0.4px',
      backgroundColor: theme.palette.background.b9,
    },
  },
  DQIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
    minWidth: 24,
    borderRadius: 12,
    '&:hover': {
      backgroundColor: ({ isErrorTypeIcon, isSuccessTypeIcon, isIssueTypeIcon }) => {
        if (isErrorTypeIcon) return 'rgba(244, 67, 54, 0.1)';
        if (isSuccessTypeIcon) return 'rgba(117, 219, 41, 0.2)';
        if (isIssueTypeIcon) return 'rgba(255, 193, 7, 0.16)';

        return 'transparent';
      },
    },
  },
}));

type StatusBadgeProps = {
  assetsData?: AssetData;
  appWidth: number;
  className?: string;
  DQIssueTooltipMaxHeight?: number;
  iconType?: 'error' | 'success' | 'issue' | '';
  lastTimestamp?: number;
  onReportErrorClick?: (description: string, assetId: number) => void;
  warningData?: Record<string, any>;
  hasSubscriptionsData?: boolean;
  currentUser: Record<string, any>;
  segment: 'drilling' | 'completion';
  maximized?: boolean;
};

export const StatusBadge = ({
  assetsData = {},
  appWidth,
  DQIssueTooltipMaxHeight = DEFAULT_TOOLTIP_MAX_HEIGHT,
  iconType,
  className,
  lastTimestamp,
  onReportErrorClick: customOnReportErrorClick,
  warningData,
  hasSubscriptionsData,
  currentUser,
  segment,
  maximized,
}: StatusBadgeProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const warningMessage = warningData?.message;
  const isErrorTypeIcon = iconType === BADGE_ICON_STATUSES.error;
  const isSuccessTypeIcon = iconType === BADGE_ICON_STATUSES.success;
  const isIssueTypeIcon = iconType === BADGE_ICON_STATUSES.issue;
  const isMobile = appWidth < MAX_MOBILE_WIDTH;
  const classes = useStyles({
    isIconExist: !!iconType,
    isSuccessTypeIcon,
    isErrorTypeIcon,
    isIssueTypeIcon,
    maximized,
  });
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = event => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) setIsTooltipOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(leaveTimeoutRef.current);
    setIsTooltipOpen(true);
  };

  const handleMouseLeave = (_, delay = 700) => {
    leaveTimeoutRef.current = setTimeout(() => setIsTooltipOpen(false), delay);
  };

  const onReportErrorClick = (description: string, selectedAssetId: number) => {
    postReportError(selectedAssetId, description, currentUser, segment);
  };

  useEffect(() => {
    if (!hasSubscriptionsData) return;

    handleMouseEnter();
    handleMouseLeave(null, 10000);
  }, [JSON.stringify(assetsData)]);

  return (
    <div
      data-testid={PAGE_NAME}
      className={classNames(classes.statusBadgeWrapper, `c-status-badge--${iconType}`, className)}
    >
      <div className={classes.statusBadgeContent} ref={tooltipRef}>
        {iconType && (
          <Tooltip
            isFullScreen={false}
            disableHoverListener
            open={isTooltipOpen}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            PopperProps={{ className: classes.popper }}
            placement="top-start"
            title={
              <DQUnvalidatedContent
                tooltipRef={tooltipRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                assetsData={assetsData}
                maxHeight={DQIssueTooltipMaxHeight}
                onClick={() => setIsOpen(true)}
              />
            }
          >
            <div
              className={classes.DQIconWrapper}
              data-testid={`${PAGE_NAME}__DQ_icon_${iconType}`}
            >
              <DQStatusIcon color={iconType} iconType={iconType} />
            </div>
          </Tooltip>
        )}
        {lastTimestamp && (
          <Typography className={classNames(classes.text, classes.timestamp)} variant="body1">
            Last Update: {moment.unix(lastTimestamp).format('M/D/YYYY h:mm a')}
          </Typography>
        )}
        {warningData && (
          <>
            <Tooltip
              placement="top"
              title={warningMessage ? `${WARNING}. ${warningMessage}` : WARNING}
            >
              <div data-testid={`${PAGE_NAME}__DQ_icon_warning`}>
                <DQStatusIcon
                  className={classes.badgeIconWarning}
                  color={BADGE_ICON_STATUSES.warning}
                  iconType={BADGE_ICON_STATUSES.warning}
                />
              </div>
            </Tooltip>
            {!isMobile && (
              <Typography
                className={classNames(classes.text, classes.warningMessage)}
                variant="body1"
              >
                {warningMessage ? `${WARNING}. ${warningMessage}` : WARNING}
              </Typography>
            )}
          </>
        )}
      </div>
      {isOpen && (
        <ReportIssueModal
          assets={Object.keys(assetsData).map(assetKey => ({
            name: assetKey,
            id: assetsData[assetKey][0].alert.assetId,
          }))}
          onSave={customOnReportErrorClick || onReportErrorClick}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
