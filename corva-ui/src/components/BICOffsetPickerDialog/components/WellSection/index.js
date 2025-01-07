import { memo } from 'react';
import { string, shape, func, arrayOf } from 'prop-types';
import classNames from 'classnames';
import {
  makeStyles,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { showSuccessNotification } from '~/utils';

import AssetSearch from './AssetSearch';
import SectionItem from './SectionItem';
import WellListItem from './WellListItem';

const PAGE_NAME = 'WellSection';

const useStyles = makeStyles(theme => ({
  content: {
    width: '472px',
    marginTop: '24px',
  },
  sectionItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    fontSize: '12px',
    fontWeight: 'normal',
    color: theme.palette.primary.text6,
    borderTop: `1px solid ${theme.palette.primary.text8}`,
    '&:last-child': {
      borderBottom: `1px solid ${theme.palette.primary.text8}`,
    },
  },
  disabledSectionItem: {
    color: theme.palette.primary.text8,
  },
  wellList: {
    width: '100%',
    margin: 0,
    padding: 0,
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
    alignItems: 'center',
  },
  advancedSearch: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#03BCD4',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

function WellSection({ company, wellSections, getWellName, onChangeWellSections, onExploreMode }) {
  const classes = useStyles();

  const selectAllWells = (targetSection, f) => {
    const selectedWellIds = wellSections
      .find(section => section.name === targetSection.name)
      .wells.map(item => item.id);

    const data = wellSections.map(section => {
      const sectionData = section.wells.map(well => {
        if (selectedWellIds.includes(well.id)) {
          return { ...well, checked: f };
        } else {
          return { ...well };
        }
      });
      return {
        ...section,
        wells: sectionData,
      };
    });
    onChangeWellSections(data);
  };

  const handleExpandCollapseSection = targetSection => {
    const data = wellSections.map(section => {
      if (section.name === targetSection.name) {
        return { ...section, expanded: !section.expanded };
      }
      return section;
    });
    onChangeWellSections(data);
  };

  const handleToggleWell = targetWell => {
    const data = wellSections.map(section => {
      const sectionData = section.wells.map(well => {
        if (well.id === targetWell.id) {
          return { ...well, checked: !well.checked };
        }
        return well;
      });
      return {
        ...section,
        wells: sectionData,
      };
    });
    onChangeWellSections(data);
  };

  const handleSelectAll = targetSection => {
    selectAllWells(targetSection, true);
  };

  const handleClearAll = targetSection => {
    selectAllWells(targetSection, false);
  };

  const handleClickAsset = (redirectAssetId, name) => {
    const data = wellSections.map(section => {
      if (section.name === 'Search Results') {
        const wells = [...section.wells];
        if (!section.wells.find(item => item.id === redirectAssetId)) {
          wells.push({ id: redirectAssetId, checked: true, name, kind: 'manual' });
        }
        return { ...section, wells };
      }
      return {
        ...section,
        wells: section.wells.map(well =>
          well.id === redirectAssetId ? { ...well, checked: true } : well
        ),
      };
    });
    onChangeWellSections(data);
    showSuccessNotification('Offset well successfully added!');
  };

  const handleOffsetPickerDialog = () => {
    onExploreMode();
  };

  return (
    <div className={classes.content}>
      <div className={classes.searchContainer}>
        <AssetSearch
          company={+company}
          onClickAsset={handleClickAsset}
          onExploreMode={onExploreMode}
        />
        <Typography
          data-testid={`${PAGE_NAME}_advancedSearch`}
          className={classes.advancedSearch}
          onClick={handleOffsetPickerDialog}
        >
          Advanced Search
        </Typography>
      </div>

      {(wellSections || []).map(section =>
        section.wells.length === 0 ? (
          <div
            key={`empty-${section.name}`}
            className={classNames(classes.sectionItem, classes.disabledSectionItem)}
          >
            <SectionItem section={section} disabled />
          </div>
        ) : (
          <div key={`section-${section.name}`} className={classes.sectionItem}>
            <Accordion
              expanded={section.expanded}
              onChange={() => handleExpandCollapseSection(section)}
            >
              <AccordionSummary expandIcon={<ExpandMore />} style={{ width: '100%' }}>
                <SectionItem
                  section={section}
                  onExpandCollapse={handleExpandCollapseSection}
                  onSelectAll={handleSelectAll}
                  onClearAll={handleClearAll}
                />
              </AccordionSummary>
              <AccordionDetails>
                <List dense className={classes.wellList}>
                  {section.wells.map(well => (
                    <WellListItem
                      key={`well-${section.name}-${well.id}`}
                      well={well}
                      wellName={getWellName(section.wells, well.id)}
                      rigName={well.rigName}
                      onToggleWell={handleToggleWell}
                    />
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </div>
        )
      )}
    </div>
  );
}

WellSection.propTypes = {
  company: string.isRequired,
  wellSections: arrayOf(shape({})),
  getWellName: func.isRequired,
  onChangeWellSections: func.isRequired,
  onExploreMode: func.isRequired,
};

WellSection.defaultProps = {
  wellSections: [],
};

// Important: Do not change root component default export (WellSection.js). Use it as container
//  for your WellSection. It's required to make build and zip scripts work as expected;
export default memo(WellSection);
