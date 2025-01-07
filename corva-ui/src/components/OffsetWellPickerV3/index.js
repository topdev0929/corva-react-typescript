import { useState, useEffect, useMemo } from 'react';
import { string, shape, func, bool } from 'prop-types';
import { get } from 'lodash';
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
import { mobileDetect } from '~/utils';

import TabSelection from './components/TabSelection';
import WellHubView from './components/WellHubView';
import OffsetWellSelectionView from './components/OffsetWellSelectionView';
import CustomSelectionView from './components/CustomSelectionView';

import { DATA_SOURCE_TYPE, SELECTION_TAB_TYPE, ALL_KEY, FILTER_BASEDON_TYPE } from './constants';

const useStyles = makeStyles(theme => ({
  paper: {
    width: ({ isTablet, isMobile }) => {
      if (isTablet) return 'calc(100% - 24px)';
      else if (isMobile) return 'calc(100% - 16px)';
      else return '1100px';
    },
    maxWidth: '1100px',
    height: ({ isTablet, isMobile }) => !isTablet && isMobile && '100%',
    minHeight: ({ isTablet, isMobile }) => isTablet || (!isMobile && '550px'),
    maxHeight: ({ isTablet, isMobile }) => {
      if (isTablet) return '702px';
      else if (isMobile) return 'calc(100% - 16px)';
      else return 'calc(100% - 64px)';
    },
    margin: ({ isMobile }) => (isMobile ? '0px' : '32px'),
    background: theme.palette.background.b9,
  },
  rootHidden: {
    transition: 'visibility 0.3s, opacity 0.3s',
    opacity: 0,
    visibility: 'hidden',
  },
  rootVisible: {
    transition: 'visibility 0.3s, opacity 0.3s',
    opacity: 1,
    visibility: 'visible',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '20px',
    color: theme.palette.primary.text1,
  },
  closeIconButton: {
    fontSize: '20px',
    background: 'transparent !important',
    padding: 4,
  },
  closeIcon: {
    color: theme.palette.primary.text6,
    '&:hover': {
      color: theme.palette.primary.text1,
    },
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: ({ isTablet }) => isTablet && '0 40px',
  },
  dialogActions: {
    padding: ({ isMobile, isTablet }) => {
      if (isTablet) return '8px 40px 40px 40px';
      else if (isMobile) return '8px 16px';
      else return '24px 40px 40px 40px';
    },
  },
  actionButtons: {
    display: 'flex',
    gap: '16px',
  },
}));

function OffsetWellPickerV3({
  open,
  dataSource,
  filterBasedOn,
  defaultSubjectWell,
  currentUser,
  offsetSettings,
  unusableWellAlarm,
  addWellsUsabilityInfo,
  onClose,
  onSave,
}) {
  const isTablet = mobileDetect.isTabletDetected;
  const isMobile = mobileDetect.isMobileDetected;
  const classes = useStyles({ isTablet, isMobile });
  const userSettings =
    dataSource === DATA_SOURCE_TYPE.offsetWellSelectionApp
      ? offsetSettings?.wdUser
      : offsetSettings?.notWdUser;

  const [selectedTab, setSelectedTab] = useState(
    userSettings?.selectedSelection || SELECTION_TAB_TYPE.bic
  );
  const [selectedSection, setSelectedSection] = useState(userSettings?.selectedSection || ALL_KEY);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [selectedOffsetWells, setSelectedOffsetWells] = useState([]);
  const [mapHidden, setMapHidden] = useState(false);
  const [filtersHidden, setFiltersHidden] = useState(false);
  const [customFilters, setCustomFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);
  const [customViewKey, setCustomViewKey] = useState('custom');
  const [isClearFilters, setIsClearFilters] = useState(false);

  useEffect(() => {
    if (!open) return;

    setSelectedTab(userSettings?.selectedSelection || SELECTION_TAB_TYPE.bic);
    setSelectedSection(userSettings?.selectedSection || ALL_KEY);
    setFilterChanged(false);
    setMapHidden(false);
    setFiltersHidden(false);
  }, [open]);

  const [companyId, setCompanyId] = useState(
    +get(defaultSubjectWell, 'companyId') ||
      +get(userSettings, 'companyId') ||
      +get(currentUser, 'company_id')
  );
  const [subjectWellId, setSubjectWellId] = useState(
    get(defaultSubjectWell, 'asset_id') || get(userSettings, 'subjectWellId') || null
  );

  useEffect(() => {
    setCompanyId(
      +get(defaultSubjectWell, 'companyId') ||
        +get(userSettings, 'companyId') ||
        +get(currentUser, 'company_id')
    );
    setSubjectWellId(
      get(defaultSubjectWell, 'asset_id') || get(userSettings, 'subjectWellId') || null
    );
  }, [userSettings]);

  const handleSaveCustomFilters = newFilters => {
    setCustomFilters(newFilters);
  };

  const handleAddOffsetWells = () => {
    const type = dataSource === DATA_SOURCE_TYPE.offsetWellSelectionApp ? 'wdUser' : 'notWdUser';
    const newOffsetSetting = {
      ...offsetSettings,
      [type]: {
        companyId,
        ...customFilters,
        selectedSelection: selectedTab,
        selectedSection,
        customWellIds:
          selectedTab === SELECTION_TAB_TYPE.custom
            ? selectedOffsetWells.map(well => well.id)
            : get(offsetSettings, [type, 'customWellIds'], []),
      },
    };
    onSave(newOffsetSetting, selectedOffsetWells);
  };

  const selectionApp = useMemo(() => {
    if (!open) return 'hidden';
    if (selectedTab === SELECTION_TAB_TYPE.bic) {
      return dataSource === DATA_SOURCE_TYPE.offsetWellSelectionApp
        ? DATA_SOURCE_TYPE.offsetWellSelectionApp
        : DATA_SOURCE_TYPE.wellHub;
    }
    return DATA_SOURCE_TYPE.customSelection;
  }, [selectedTab, dataSource, open]);

  const handleClose = () => {
    if (filterChanged) {
      setFilterChanged(false);
      setCustomViewKey(`custom-${Math.random()}`);
    }
    onClose();
  };
  return (
    <>
      <Dialog
        open
        onBackdropClick={handleClose}
        onEscapeKeyDown={handleClose}
        classes={{
          paper: classes.paper,
          root: open ? classes.rootVisible : classes.rootHidden,
        }}
      >
        <DialogTitle>
          <div className={classes.titleWrapper}>
            <Typography className={classes.title}>Offset Wells</Typography>
            <Tooltip title="Close">
              <IconButton
                data-not-migrated-muiiconbutton
                aria-label="close"
                className={classes.closeIconButton}
                onClick={handleClose}
              >
                <CloseIcon className={classes.closeIcon} />
              </IconButton>
            </Tooltip>
          </div>
        </DialogTitle>

        <DialogContent className={classes.dialogContent}>
          <TabSelection
            dataSource={dataSource}
            filterBasedOn={filterBasedOn}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            sectionOptions={sectionOptions}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            mapHidden={mapHidden}
            onToggleMap={setMapHidden}
            filtersHidden={filtersHidden}
            onToggleFilters={setFiltersHidden}
            isTablet={isTablet}
            isMobile={isMobile}
            customFilters={customFilters}
            setIsClearFilters={setIsClearFilters}
          />

          <OffsetWellSelectionView
            open={selectionApp === DATA_SOURCE_TYPE.offsetWellSelectionApp}
            companyId={companyId}
            subjectWellId={subjectWellId}
            filterBasedOn={filterBasedOn}
            setSectionOptions={setSectionOptions}
            selectedSection={selectedSection}
            setSelectedOffsetWells={setSelectedOffsetWells}
            isTablet={isTablet}
            isMobile={isMobile}
          />

          <WellHubView
            open={selectionApp === DATA_SOURCE_TYPE.wellHub}
            subjectWellId={subjectWellId}
            setSelectedOffsetWells={setSelectedOffsetWells}
            isTablet={isTablet}
            isMobile={isMobile}
          />

          <CustomSelectionView
            key={customViewKey}
            open={selectionApp === DATA_SOURCE_TYPE.customSelection}
            defaultSubjectWellId={get(defaultSubjectWell, 'asset_id')}
            companyId={companyId}
            userSettings={userSettings}
            currentUser={currentUser}
            addWellsUsabilityInfo={addWellsUsabilityInfo}
            unusableWellAlarm={unusableWellAlarm}
            mapHidden={mapHidden}
            filtersHidden={filtersHidden}
            setSelectedOffsetWells={setSelectedOffsetWells}
            setFilterChanged={setFilterChanged}
            onSave={handleSaveCustomFilters}
            isTablet={isTablet}
            isMobile={isMobile}
            onToggleFilters={setFiltersHidden}
            isClearFilters={isClearFilters}
            setIsClearFilters={setIsClearFilters}
          />
        </DialogContent>

        <DialogActions className={classes.dialogActions}>
          <div className={classes.actionButtons}>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleAddOffsetWells}>
              Select ({selectedOffsetWells.length})
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

OffsetWellPickerV3.propTypes = {
  open: bool.isRequired,
  dataSource: string,
  filterBasedOn: string,
  defaultSubjectWell: shape({}),
  currentUser: shape({}),
  offsetSettings: shape(),
  unusableWellAlarm: string,
  addWellsUsabilityInfo: func,
  onClose: func.isRequired,
  onSave: func.isRequired,
};

OffsetWellPickerV3.defaultProps = {
  dataSource: DATA_SOURCE_TYPE.offsetWellSelectionApp,
  filterBasedOn: FILTER_BASEDON_TYPE.wellSections,
  defaultSubjectWell: null,
  currentUser: {},
  offsetSettings: {},
  unusableWellAlarm: 'Unable to add',
  addWellsUsabilityInfo: null,
};

export default OffsetWellPickerV3;
