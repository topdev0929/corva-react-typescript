import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { get, uniq, includes, isEqual } from 'lodash';
import classnames from 'classnames';
import {
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { LoadingIndicator, OffsetWellPickerV2 } from '~/components';

import WellsMap from './components/Map';
import WellSection from './components/WellSection';
import { useWells, useFetchBicWellsData } from './effects';

import { DEFAULT_WELL_SECTIONS } from './constants';

const PAGE_NAME = 'BICOffsetPickerDialog';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '552px',
  },
  dialogTitles: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '20px',
    color: theme.palette.primary.text1,
  },
  description: {
    fontSize: '16px',
    fontWeight: 'normal',
    color: theme.palette.primary.text6,
    marginTop: 16,
  },
  closeIconButton: {
    fontSize: '20px',
    padding: 4,
    '&:hover $closeIcon': {
      color: '#fff',
    },
  },
  closeIcon: {
    color: theme.palette.primary.text6,
  },
  topShadow: {
    width: '100%',
    height: '16px',
    backgroundImage: `linear-gradient(0deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9})`,
    position: 'absolute',
    top: '155px',
    zIndex: 2,
  },
  bottomShadow: {
    width: '100%',
    height: '16px',
    backgroundImage: `linear-gradient(180deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9})`,
    position: 'absolute',
    bottom: '52px',
    zIndex: 2,
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingBottom: 8,
  },
  dialogActionsSmallScreen: {
    paddingRight: '100px', // Intercom
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
  },
}));

function getWellName(wells, wellId) {
  const well = wells.find(item => item.id === wellId);
  return get(well, 'name') || '-';
}

function getRigName(wells, wellId) {
  const well = wells.find(item => item.id === wellId);
  return get(well, 'rigName') || '-';
}

function getSectionName(area, filterMode) {
  if (area.value === 'well') return 'Best Wells';
  else if (area.value === 'area') return 'Area Offsets';
  else if (filterMode === 'section') return `Best ${area.value} Wells`;
  return `Best ${area.value} " Wells`;
}

function sortWells(sections) {
  const sortedWells = sections.map(section => ({
    ...section,
    wells: section.wells.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }),
  }));
  return sortedWells;
}

function getResultWellIds(offsetSetting) {
  const bicWellIds = get(offsetSetting, 'bicWellIds') || [];
  const manualWellIds = get(offsetSetting, 'manualWellIds') || [];
  const selectedWellIds = get(offsetSetting, 'selectedWellIds') || [];
  const resultWellIds = uniq(bicWellIds.concat(manualWellIds).concat(selectedWellIds));
  return resultWellIds;
}

function BICOffsetPickerDialog({
  defaultSubjectWell,
  offsetSetting,
  currentUser,
  isOpen,
  onClose,
  onSave,
  addWellsUsabilityInfo,
  unusableWellAlarm,
}) {
  const [scrolling, setScrolling] = useState(false);
  const classes = useStyles({ scrolling });
  const dialogContentRef = useRef(null);
  const loadingRef = useRef(true);
  const [companyId, setCompanyId] = useState(
    get(defaultSubjectWell, 'companyId') ||
      get(offsetSetting, 'companyId') ||
      +get(currentUser, 'company_id')
  );
  const [subjectWellId, setSubjectWellId] = useState(
    get(defaultSubjectWell, 'asset_id') || get(offsetSetting, 'subjectWellId') || null
  );
  const wells = useWells(companyId, isOpen);
  const bicData = useFetchBicWellsData(subjectWellId, isOpen);
  const [wellSections, setWellSections] = useState([]);
  const [isOpenOffsetDialog, setIsOpenOffsetsDialog] = useState(false);
  const [interimOffsetSetting, setInterimOffsetSetting] = useState(offsetSetting);
  const [expandedSearchResult, setExpandedSearchResult] = useState(false);
  const offsetWells = useMemo(() => {
    if (wells) {
      const resultWellIds = getResultWellIds(interimOffsetSetting);
      const data = wells.filter(well => resultWellIds.find(id => id === get(well, 'id')));
      return data;
    }
    return [];
  }, [wells, interimOffsetSetting]);

  useEffect(() => {
    if (isOpen) {
      setCompanyId(
        get(defaultSubjectWell, 'companyId') ||
          get(offsetSetting, 'companyId') ||
          +get(currentUser, 'company_id')
      );
      setSubjectWellId(
        get(defaultSubjectWell, 'asset_id') || get(offsetSetting, 'subjectWellId') || null
      );
      setInterimOffsetSetting(offsetSetting);
      setExpandedSearchResult(false);
      loadingRef.current = true;
    }
  }, [offsetSetting, isOpen]);

  // NOTE: update well section wells data
  useEffect(() => {
    if (!isOpen || !wells || !loadingRef.current) return;

    const selectedWellIds = get(interimOffsetSetting, 'selectedWellIds') || [];
    const manualWellIds = get(interimOffsetSetting, 'manualWellIds') || [];
    const bicWellIds = get(interimOffsetSetting, 'bicWellIds') || [];

    // Make Search Results Tab
    const allManualWellIds = selectedWellIds.concat(manualWellIds);
    const searchResults = allManualWellIds
      .filter(id => wells.find(well => well.id === id))
      .map(id => {
        return {
          id,
          checked: true,
          name: getWellName(wells, id),
          rigName: getRigName(wells, id),
          kind: selectedWellIds.includes(id) ? 'advanced' : 'manual',
        };
      });

    // Make Best Wells Tabs
    let mergedSections;
    if (!bicData || !bicData.filters || !bicData.result) {
      mergedSections = [
        { name: 'Search Results', wells: searchResults, expanded: expandedSearchResult },
        ...DEFAULT_WELL_SECTIONS,
      ];
    } else {
      const bestWellIds = [];
      const filteredTabs = [
        { name: 'Wells within Area', value: 'area' },
        ...get(bicData, ['filters', 'filterTabs']),
      ];
      const filterMode = bicData.filters?.filterMode || 'holeSize';
      const tabs = uniq(filteredTabs);
      mergedSections = [
        { name: 'Search Results', wells: searchResults, expanded: expandedSearchResult },
        ...tabs.map(area => {
          return {
            name: getSectionName(area, filterMode),
            wells:
              bicData.result[area.value]
                ?.filter(id => wells.find(well => well.id === id))
                .map(item => {
                  const id = typeof item === 'object' ? item.id : item;
                  bestWellIds.push(id);
                  return {
                    id,
                    checked: false,
                    name: getWellName(wells, id),
                    rigName: getRigName(wells, id),
                    kind: 'best',
                  };
                }) || [],
            expanded: false,
          };
        }),
      ];
    }

    // Check if any best well is checked
    const sectionsData = mergedSections.map(section => {
      const data = section.wells.map(item => {
        if (includes(bicWellIds, item.id) || includes(allManualWellIds, item.id)) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return { ...item };
        }
      });
      return {
        ...section,
        wells: data,
      };
    });
    // Sort by name
    setWellSections(sortWells(sectionsData));
  }, [isOpen, wells, bicData, interimOffsetSetting]);

  // NOTE: BIC Wells
  const handleChangeWellSections = sections => {
    const sortedSections = sortWells(sections);
    setWellSections(sortedSections);
    setExpandedSearchResult(sortedSections[0].expanded);

    const newSelectedWellIds = [];
    const newManualWellIds = [];
    const newBicWellIds = [];
    sortedSections.forEach(section => {
      section.wells.forEach(well => {
        if (well.checked && well.kind === 'advanced') newSelectedWellIds.push(well.id);
        if (well.checked && well.kind === 'manual') newManualWellIds.push(well.id);
        if (well.checked && well.kind === 'best') newBicWellIds.push(well.id);
      });
    });
    const newResultWellIds = newSelectedWellIds.concat(newManualWellIds).concat(newBicWellIds);
    const newOffsetSetting = {
      ...interimOffsetSetting,
      selectedWellIds: uniq(newSelectedWellIds),
      manualWellIds: uniq(newManualWellIds),
      bicWellIds: uniq(newBicWellIds),
      resultWellIds: uniq(newResultWellIds),
    };
    setInterimOffsetSetting(newOffsetSetting);
    loadingRef.current = false;
  };

  const handleCloseAdvancedWells = () => {
    setIsOpenOffsetsDialog(false);
  };

  const handleAddAdvancedWells = newOffsetSetting => {
    let offsetSettings = newOffsetSetting;
    if (!defaultSubjectWell) {
      if (
        !isEqual(subjectWellId, get(offsetSettings, 'subjectWellId')) ||
        !isEqual(companyId, get(offsetSettings, 'companyId'))
      ) {
        offsetSettings = {
          ...offsetSettings,
          bicWellIds: [],
          manualWellIds: [],
          resultWellIds: [],
        };
      }
      setSubjectWellId(get(offsetSettings, 'subjectWellId'));
      setCompanyId(get(offsetSettings, 'companyId'));
    }

    let manualWellIds = get(offsetSettings, 'manualWellIds') || [];
    const selectedWellIds = get(offsetSettings, 'selectedWellIds') || [];
    manualWellIds = manualWellIds.filter(id => !selectedWellIds.includes(id));
    offsetSettings = {
      ...offsetSettings,
      manualWellIds,
    };
    setInterimOffsetSetting(offsetSettings);
    loadingRef.current = true;
    setExpandedSearchResult(true);
    setIsOpenOffsetsDialog(false);
  };

  const handleOpenAdvancedDialog = () => {
    setIsOpenOffsetsDialog(true);
  };

  const handleAdd = () => {
    const resultWellIds = getResultWellIds(interimOffsetSetting);

    const allOffsetWells = wells.filter(well => includes(resultWellIds, well.id));
    const newOffsetSetting = {
      ...interimOffsetSetting,
      companyId: +companyId,
      resultWellIds,
    };

    setIsOpenOffsetsDialog(false);
    onSave(newOffsetSetting, allOffsetWells);
  };

  const getResultCount = useCallback(() => {
    const resultWellIds = getResultWellIds(interimOffsetSetting);
    return resultWellIds.length;
  }, [interimOffsetSetting]);

  const getBestCount = useCallback(() => {
    const bicWellIds = get(interimOffsetSetting, 'bicWellIds') || [];
    return bicWellIds.length;
  });
  const scrollTimeoutRef = useRef(null);

  const handleScroll = () => {
    setScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setScrolling(false);
    }, 1000);
  };

  const isLoading = !wells;

  return (
    <>
      <Dialog
        onBackdropClick={onClose}
        onEscapeKeyDown={onClose}
        open={isOpen}
        classes={{ paper: classes.paper }}
      >
        <DialogTitle>
          <div className={classes.dialogTitles}>
            <div className={classes.titleContent}>
              <Typography className={classes.title}>Select Offset Wells</Typography>
              <Tooltip title="Close">
                <IconButton
                  data-not-migrated-muiiconbutton
                  aria-label="close"
                  className={classes.closeIconButton}
                  onClick={onClose}
                >
                  <CloseIcon className={classes.closeIcon} />
                </IconButton>
              </Tooltip>
            </div>
            <div className={classes.description}>
              Quickly add all of the Best-In-Class Wells per section selected from the Offsets Well
              Selection Application.
            </div>
          </div>
        </DialogTitle>
        {scrolling && <div className={classes.topShadow} />}
        <DialogContent
          className={classes.dialogContent}
          ref={dialogContentRef}
          onScroll={handleScroll}
        >
          {!isLoading ? (
            <>
              <WellsMap wells={offsetWells} offsetWells={offsetWells} />
              <WellSection
                company={companyId}
                wellSections={wellSections}
                getWellName={getWellName}
                onChangeWellSections={handleChangeWellSections}
                onExploreMode={handleOpenAdvancedDialog}
              />
            </>
          ) : (
            <LoadingIndicator fullscreen={false} />
          )}
        </DialogContent>
        <div className={classes.bottomShadow} />
        <DialogActions className={classnames(classes.dialogActions)}>
          <div className={classes.buttonContainer}>
            <Button data-testid={`${PAGE_NAME}_cancel`} onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              data-testid={`${PAGE_NAME}_add`}
              variant="contained"
              color="primary"
              onClick={handleAdd}
            >
              Add ({getResultCount()})
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {isOpenOffsetDialog && (
        <OffsetWellPickerV2
          defaultSubjectWellId={get(defaultSubjectWell, 'asset_id')}
          companyId={+companyId}
          offsetSetting={interimOffsetSetting}
          currentUser={currentUser}
          addWellsUsabilityInfo={addWellsUsabilityInfo}
          unusableWellAlarm={unusableWellAlarm}
          isAdvancedSearch
          bestCount={getBestCount()}
          isOpen={isOpenOffsetDialog}
          onClose={handleCloseAdvancedWells}
          onSave={handleAddAdvancedWells}
        />
      )}
    </>
  );
}

BICOffsetPickerDialog.propTypes = {
  defaultSubjectWell: PropTypes.shape({}),
  offsetSetting: PropTypes.shape({
    subjectWellId: PropTypes.number,
    companyId: PropTypes.number,
  }),
  currentUser: PropTypes.shape({}),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  addWellsUsabilityInfo: PropTypes.func, // update offset wells usability info in specific apps ("is_usable" field)
  unusableWellAlarm: PropTypes.string,
};

BICOffsetPickerDialog.defaultProps = {
  defaultSubjectWell: null,
  addWellsUsabilityInfo: null,
  unusableWellAlarm: 'Unable to add',
  offsetSetting: {},
  currentUser: {},
};

export default BICOffsetPickerDialog;
