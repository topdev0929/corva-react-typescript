import classNames from "classnames";
import {Alert, AlertState, ALERT_ICONS, ALERT_STATES } from '~/components/StatusBadge/constants';
import { DQAlertsTooltip } from '~/components/StatusBadge/components/DQAlertsTooltip';
import { useDQUnvalidatedContentStyles } from '~/components/StatusBadge/styles';
import { isResolved } from '~/components/StatusBadge/utils';

type DQAlertTooltipProps = {
  alertsNum: number;
  alertState: AlertState;
  isIssueData: boolean;
  alert: Alert;
  linkToDQPage: string;
};

export const DQAlertTooltip = ({ alert, alertsNum, alertState, isIssueData, linkToDQPage }: DQAlertTooltipProps): JSX.Element => {
  const classes = useDQUnvalidatedContentStyles({});
  const isAlertResolved = isResolved(alert.status);
  const AlertIcon = isAlertResolved? ALERT_ICONS.Resolved : ALERT_ICONS[alertState];

  return (
    <DQAlertsTooltip
      alert={alert}
      alertIcon={<AlertIcon className={classNames(classes[alertState], classes.alertIcon)} />}
      linkToDQPage={linkToDQPage}
    >
      <div className={classNames(
        classes.errorContainer,
        { [classes.missingContainer]: isIssueData && alertState === ALERT_STATES.missing }
      )}>
        <AlertIcon
          className={classNames({
              [classes[alertState]]: !isAlertResolved,
              [classes.Resolved]: isAlertResolved,
            },
            classes.alertIcon)}
        />
        <div>
          {!isAlertResolved && (
              <>
                <span className={classNames(classes[alertState], classes.errorText)}>{alertState}: </span>
                <span className={classes.errorNum}>{alertsNum}</span>
              </>
            )}
        </div>
      </div>
    </DQAlertsTooltip>
  );
};
