import { useState } from 'react';
import { shape, arrayOf, string, func, bool } from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
import { Accordion, AccordionDetails, AccordionSummary, Tooltip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Counter from '~/components/Counter';
import BHATile from '../BHATile';
import styles from './styles.css';

function BHAList({
  isMobile,
  drillstringsBySection,
  selectedBha,
  isMetricsHidden,
  onSelectBha,
  contentClassName,
}) {
  const [sectionsToggleState, setSectionsToggleState] = useState({});

  const handleToggleSection = targetSection => {
    setSectionsToggleState(prev => {
      return {
        ...prev,
        [targetSection.name]: !prev[targetSection.name],
      };
    });
  };

  return (
    <div className={styles.bhaListContainer}>
      <div className={classNames(styles.bhaList, contentClassName)}>
        {drillstringsBySection.map(section => (
          <Tooltip
            key={section.name}
            title={section?.drillstrings?.length === 0 ? 'No BHA in section' : ''}
            placement="bottom-start"
          >
            <Accordion
              expanded={!sectionsToggleState[section.name]}
              disabled={section?.drillstrings?.length === 0}
              classes={{ root: styles.accordionRoot }}
              onChange={() => handleToggleSection(section)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                classes={{
                  root: styles.accordionSummaryRoot,
                  content: styles.accordionSummaryContent,
                }}
              >
                {section.name}
                <Counter
                  size="medium"
                  label={section?.drillstrings.length}
                  className={styles.counter}
                />
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.sectionContent}>
                  {section.drillstrings.map(drillstring => (
                    <div key={get(drillstring, '_id')} className={styles.tileWrapper}>
                      <BHATile
                        drillstring={drillstring}
                        isSelected={get(selectedBha, '_id') === get(drillstring, '_id')}
                        isMetricsHidden={isMetricsHidden}
                        onSelect={onSelectBha}
                        isMobile={isMobile}
                      />
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          </Tooltip>
        ))}
      </div>
      <div
        className={classNames(styles.bottomGradient, { [styles.bottomGradientMobile]: isMobile })}
      />
    </div>
  );
}

BHAList.propTypes = {
  isMobile: bool,
  drillstringsBySection: arrayOf(
    shape({
      name: string,
      drillstrings: arrayOf(
        shape({
          _id: string,
          data: shape({}),
        })
      ),
    })
  ),
  selectedBha: shape({ _id: string }),
  isMetricsHidden: bool,
  onSelectBha: func.isRequired,
  contentClassName: string,
};

BHAList.defaultProps = {
  isMobile: false,
  drillstringsBySection: [],
  selectedBha: null,
  isMetricsHidden: true,
  contentClassName: null,
};

export default BHAList;
