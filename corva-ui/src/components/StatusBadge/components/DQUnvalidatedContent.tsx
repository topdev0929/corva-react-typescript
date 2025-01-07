import { MouseEventHandler, RefObject } from 'react';
import classNames from 'classnames';
import { Typography, Accordion, AccordionDetails, AccordionSummary, Tooltip } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Button from '~/components/Button';
import { truncateString } from '~/components/Search/utils/truncate';
import { AssetData } from '~/components/StatusBadge/constants';
import { useDQUnvalidatedContentStyles } from '~/components/StatusBadge/styles';
import { UniversalLink } from '~/components/DevCenter/DevCenterRouterContext/UniversalLink';

import { DQAccordionDetailsContent } from './DQAccordionDetailsContent';

type DQUnvalidatedContentProps = {
  assetsData?: AssetData;
  maxHeight?: number;
  onClick: () => void;
  onMouseLeave: MouseEventHandler<HTMLDivElement>;
  onMouseEnter: () => void;
  tooltipRef: RefObject<HTMLDivElement>;
}

export const DQUnvalidatedContent = ({
  assetsData,
  maxHeight,
  onClick,
  onMouseLeave,
  onMouseEnter,
  tooltipRef,
}: DQUnvalidatedContentProps): JSX.Element => {
  const classes = useDQUnvalidatedContentStyles({ maxHeight });

  return (
    <div
      ref={tooltipRef}
      className={classes.container}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <div>
        <Typography className={classes.headerText} data-testid='Status_badge__DQ_unvalidated_content'>
          Data Quality
        </Typography>
        <Typography className={classes.subheaderText}>
          Fusion real-time data quality rules for app data
        </Typography>
      </div>
      <div className={classes.relative}>
        <div className={classes.accordionsWrapper}>
          {Object.keys(assetsData).map(assetKey => {
            const assets = assetsData[assetKey];

            return (
              <Accordion className={classes.accordion} defaultExpanded key={assetKey}>
                <AccordionSummary className={classNames('large', 'stretched')}>
                  <div className={classes.headerWrapper}>
                    <span>
                      {truncateString(assetKey, { maxChars: 35, charsNumFromStart: 13, charsNumFromEnd: 12 })}
                    </span>
                    <Tooltip title="Go to Data Quality page">
                      <div>
                        <UniversalLink
                          className={classes.link}
                          href={assets[0]?.linkToDQPage}
                        >
                          <ArrowForwardIcon className={classes.linkIcon}/>
                        </UniversalLink>
                      </div>
                    </Tooltip>
                  </div>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <DQAccordionDetailsContent assets={assets} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>
      <div className={classes.reportDQIssueButtonWrapper}>
        <Button
          className={classes.reportDQIssueButton}
          onClick={onClick}
          variation='secondary'
        >
          report data issue
        </Button>
      </div>
    </div>
  );
};
