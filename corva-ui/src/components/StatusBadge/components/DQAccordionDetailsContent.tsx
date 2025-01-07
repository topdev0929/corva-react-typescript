import classNames from 'classnames';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { useDQUnvalidatedContentStyles } from '~/components/StatusBadge/styles';
import { ALERT_STATES, Alert, AlertState, AssetItem } from '~/components/StatusBadge/constants';
import { DQAlertTooltip } from '~/components/StatusBadge/components/DQAlertTooltip';

type DQAccordionDetailsContentProps = { assets: AssetItem[] };

type GetAlertPropsType = (state: AlertState) => ({
  alert: Alert;
  alertsNum: number;
  alertState: AlertState;
  isIssueData: boolean;
  linkToDQPage: string;
});

export const DQAccordionDetailsContent = ({ assets }: DQAccordionDetailsContentProps): JSX.Element => {
  const classes = useDQUnvalidatedContentStyles({});

  const assetsGroupedByCategory = assets.reduce((acc, curr) => {
    if (!acc[curr.alert.category])
      acc[curr.alert.category] = [];

    acc[curr.alert.category] = [ ...acc[curr.alert.category], curr ];
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(assetsGroupedByCategory).map(categoryKey => (
        <Accordion defaultExpanded key={categoryKey}>
          <AccordionSummary
            className={classNames('left', classes.categoryName)}
            expandIcon={<ExpandMoreIcon />}
          >
            {`${categoryKey} (${assetsGroupedByCategory[categoryKey].length})`}
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.assetTable}>
              {assetsGroupedByCategory[categoryKey].map(({ id, name, issuesNum, missingNum, isResolved, alert, linkToDQPage }) => {
                const getAlertProps: GetAlertPropsType = (state) => ({
                  alert,
                  alertsNum: state === ALERT_STATES.issue ? issuesNum : missingNum,
                  alertState: state === ALERT_STATES.issue ? ALERT_STATES.issue : ALERT_STATES.missing,
                  isIssueData: issuesNum > 0,
                  linkToDQPage,
                });
                const issueAlertProps = getAlertProps(ALERT_STATES.issue);
                const missingAlertProps = getAlertProps(ALERT_STATES.missing);

                return (
                  <div className={classes.assetWrapper} key={id}>
                    <div className={classNames(classes.assetName, classes.assetCell)}>{name}</div>
                    {isResolved ? (
                      <div className={classes.assetCell}>
                        <DQAlertTooltip {...issueAlertProps} />
                      </div>
                    ) : (
                      <>
                        {issuesNum > 0 && (
                          <div className={classes.assetCell}>
                            <DQAlertTooltip {...issueAlertProps} />
                          </div>
                        )}
                        {missingNum > 0 && (
                          <div className={classes.assetCell}>
                            <DQAlertTooltip {...missingAlertProps} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};
