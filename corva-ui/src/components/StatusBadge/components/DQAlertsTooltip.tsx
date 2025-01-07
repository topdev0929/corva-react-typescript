import { ReactElement } from 'react';
import moment from 'moment';
import { template } from 'lodash';
import { makeStyles } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Tooltip from '~/components/Tooltip';
import {
  getDeductsFromScoreValue,
  isResolved,
  getDeductsFromScoreClass,
} from '~/components/StatusBadge/utils';
import { Alert, ALERT_STATES, BADGE_ICON_STATUSES } from '~/components/StatusBadge/constants';
import { UniversalLink } from '~/components/DevCenter/DevCenterRouterContext/UniversalLink';
import { useDQUnvalidatedContentStyles } from '~/components/StatusBadge/styles';

const useStyles = makeStyles(theme => ({
  errorIcon: {
    width: 20,
    height: 18,
  },
  title: {
    maxWidth: 198,
    padding: '0 0 8px',
    fontSize: 16,
    lineHeight: '22px',
    color: theme.palette.primary.text1,
    display: 'flex',
    alignItems: 'center',
  },
  emptyMessage: {
    padding: '0',
    fontSize: 16,
    lineHeight: '22px',
    color: theme.palette.primary.contrastText,
  },
  alertTime: {
    fontSize: 14,
    color: theme.palette.primary.text6,

    '& span': {
      color: theme.palette.primary.text1,
    },
  },
  alertMessage: {
    width: '100%',
    height: 40,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    whiteSpace: 'pre-wrap',
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.primary.text1,
  },
  alertMessageFull: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.primary.text1,
    whiteSpace: 'pre-wrap',
  },
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
    fontSize: 14,
    textTransform: 'capitalize',

    '& span': {
      color: theme.palette.primary.text6,
      marginRight: 8,
    },

    '& .error': {
      color: theme.palette.error.main,
    },
    '& .warning': {
      color: '#ffa500',
    },
  },
  resolvedInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
    color: theme.palette.primary.text6,
    fontSize: 14,
  },
  infoIcon: {
    color: theme.palette.info.main,
    marginRight: 8,
    fontSize: 16,
  },
  popover: {
    marginLeft: 77,
    width: 270,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.b9,
    border: `1px solid ${theme.palette.primary.text9}`,
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.4)',
    borderRadius: 4,
    zIndex: 500,
    '& .MuiTooltip-tooltip': {
      backgroundColor: theme.palette.background.b9,
      fontWeight: 400,
      lineHeight: '20px',
      margin: 0,
      padding: 0,
    },
  },
  message: { whiteSpace: 'pre-wrap' },
  note: { marginBottom: 4 },
  ok: { color: '#F99500 !important' },
  good: { color: `${theme.palette.warning.light} !important` },
}));

const formatDate = (date, format = 'MM/DD/YY hh:mm a') => {
  if (!date) return null;

  return moment.unix(date).format(format);
};

const timestampFormatter = timestamp => {
  return moment.unix(timestamp).format('DD MMM HH:mm (Z)');
};

const FormattedMessage = ({ children }) => {
  const styles = useStyles();
  const compiled = template(children);
  const messageParts = compiled({
    timestampFormatter,
  })
    // Support of **Bold** syntax just for backward compatibility
    .split('**')
    .map((message, i) => (i % 2 === 1 ? <b>{message}</b> : message));
  return <span className={styles.message}>{messageParts}</span>;
};

type DQCountryCheckTooltipProps = {
  alert: Alert;
  alertIcon: ReactElement;
  children: ReactElement<any, any>;
  linkToDQPage: string;
};

export const DQAlertsTooltip = ({
  alert,
  alertIcon,
  children,
  linkToDQPage,
}: DQCountryCheckTooltipProps): JSX.Element => {
  const classes = useStyles();
  const DQUnvalidatedContentClasses = useDQUnvalidatedContentStyles({});
  const latestUpdateTime = Math.max(alert.statusUpdatedAt, alert.lastCheckedAt);
  const statusUpdatedAt = formatDate(latestUpdateTime);

  return (
    <Tooltip
      isFullScreen={false}
      interactive
      children={children}
      PopperProps={{ className: classes.popover }}
      placement="right"
      title={
        alert.emptyMessage ? (
          <div className={classes.emptyMessage}>{alert.emptyMessage}</div>
        ) : (
          <>
            <div className={classes.title}>
              {alert.name}
              <Tooltip isFullScreen={false} title="Go to Data Quality page">
                <div>
                  <UniversalLink className={DQUnvalidatedContentClasses.link} href={linkToDQPage}>
                    <ArrowForwardIcon className={DQUnvalidatedContentClasses.linkIcon} />
                  </UniversalLink>
                </div>
              </Tooltip>
            </div>
            <span className={classes.alertInfo}>
              <span>Category:</span> {alert.category}
            </span>
            <span className={classes.alertInfo}>
              <span>Status:</span> {alert.status}
            </span>
            <span className={classes.alertInfo}>
              <span>Error Type:</span>
              <div className={classes.errorIcon}>{alertIcon}</div>
              <span
                className={
                  alert.state === ALERT_STATES.issue
                    ? BADGE_ICON_STATUSES.warning
                    : BADGE_ICON_STATUSES.error
                }
              >
                {alert.state}
              </span>
            </span>
            <span className={classes.alertInfo}>
              <span>Score Deduction:</span>
              <span
                className={getDeductsFromScoreClass(
                  classes,
                  alert.deductsFromScore,
                  isResolved(alert.status)
                )}
              >
                {getDeductsFromScoreValue(alert.deductsFromScore, isResolved(alert.status))}
              </span>
            </span>
            <div className={classes.alertMessageFull}>
              {alert.isThrottled && <b>[Throttled]: </b>}
              <FormattedMessage>{alert.message}</FormattedMessage>
            </div>
            <span className={classes.alertInfo}>
              <span className={classes.note}>Note:</span> {alert.note?.length ? alert.note : '—'}
            </span>
            <span className={classes.alertTime}>
              Updated at: <span>{statusUpdatedAt}</span>
            </span>
          </>
        )
      }
    />
  );
};
