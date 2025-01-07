import { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import useTinyStateMachine from 'use-tiny-state-machine';
import { isEmpty, get } from 'lodash';
import Jsona from 'jsona';

import {
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { getPads } from '~/clients/jsonApi';

const dataFormatter = new Jsona();

const useStyles = makeStyles({
  fabSmallBtn: {
    width: 24,
    height: 24,
    minHeight: 24,
    margin: '0 6px 0 1px',
  },
  fabSmallBtnIcon: {
    width: 20,
    height: 20,
  },
  dialogPaper: {
    width: '75%',
    maxWidth: 420,
  },
});

function fetchPadsAction({ dispatch, context }) {
  getPads({
    fields: ['pad.name', 'pad.wells'],
    sort: 'name',
    per_page: 1000,
    company: context.companyId,
  })
    .then(result => dataFormatter.deserialize(result))
    .then(result => result.filter(pad => !isEmpty(get(pad, 'wells'))))
    .then(filteredPads => dispatch('PADS_REQUEST_SUCCESS', filteredPads))
    .catch(error => dispatch('FAILURE', error));
}

function getWellsAction({ dispatch }, selectedPadsData) {
  const wellsData = selectedPadsData.reduce((result, padData) => {
    return result.concat(padData.wells);
  }, []);

  dispatch('WELLS_REQUEST_SUCCESS', wellsData);
}

const assetStateChart = {
  id: 'requests',
  initial: 'idle',
  context: {
    padsData: [],
    wellsData: [],
    lastStage: [],
    error: null,
    companyId: 0,
  },
  states: {
    idle: {
      on: {
        FETCH_PADS: {
          target: 'pending',
          action: fetchPadsAction,
        },
      },
    },
    pending: {
      on: {
        PADS_REQUEST_SUCCESS: {
          target: 'success',
          beforeStateChange: ({ updateContext }, padsData) =>
            updateContext(currentContext => ({ ...currentContext, padsData })),
        },
        FAILURE: {
          target: 'failure',
          beforeStateChange: (_, error) => {
            throw new Error(error.message);
          },
        },
      },
    },
    success: {
      on: {
        FETCH_WELLS: {
          target: 'success',
          action: getWellsAction,
        },
        WELLS_REQUEST_SUCCESS: {
          target: 'success',
          beforeStateChange: ({ updateContext }, wellsData) =>
            updateContext(currentContext => ({ ...currentContext, wellsData })),
        },
      },
    },
  },
};

const dialogStateChart = {
  id: 'dialog',
  initial: 'closed',
  context: {
    selectedPadIds: [],
    selectedWellIds: [],
  },
  states: {
    closed: {
      on: {
        OPEN_DIALOG: {
          target: 'open',
          beforeStateChange: ({ updateContext }, { currentWellIds, padsData }) => {
            const currentPadIds = [];

            if (!isEmpty(currentWellIds)) {
              padsData.forEach(pad => {
                pad.wells.forEach(well => {
                  if (currentWellIds.includes(well.asset_id) && !currentPadIds.includes(pad.id)) {
                    currentPadIds.push(pad.id);
                  }
                });
              });
            }

            return updateContext(currentContext => ({
              ...currentContext,
              selectedPadIds: [...currentPadIds],
              selectedWellIds: [...currentWellIds],
            }));
          },
        },
      },
    },
    open: {
      on: {
        CLOSE_DIALOG: {
          target: 'closed',
          beforeStateChange: ({ updateContext }) =>
            updateContext(currentContext => ({
              ...currentContext,
              selectedPadIds: [],
              selectedWellIds: [],
            })),
        },
        SET_PAD_ID: {
          target: 'open',
          beforeStateChange: ({ updateContext }, { selectedPadIds, currentWellIds, padsData }) => {
            const currentWells = [];
            if (!isEmpty(currentWellIds)) {
              padsData.forEach(pad => {
                pad.wells.forEach(well => {
                  if (selectedPadIds.includes(pad.id) && currentWellIds.includes(well.asset_id)) {
                    currentWells.push(well.asset_id);
                  }
                });
              });
            }

            return updateContext(currentContext => ({
              ...currentContext,
              selectedPadIds,
              selectedWellIds: [...currentWells],
            }));
          },
        },
        SET_WELL_ID: {
          target: 'open',
          beforeStateChange: ({ updateContext }, selectedWellIds) =>
            updateContext(currentContext => ({ ...currentContext, selectedWellIds })),
        },
      },
    },
  },
};

const PadOffsetsPicker = ({ onSave, currentOffsetSetting, assets, companyId }) => {
  const classes = useStyles();
  const {
    state: requestState,
    dispatch: requestDispatch,
    context: requestContext,
  } = useTinyStateMachine(assetStateChart);
  const {
    state: dialogState,
    dispatch: dialogDispatch,
    context: dialogContext,
  } = useTinyStateMachine(dialogStateChart);

  const currentOffsetIds = useMemo(
    () =>
      isEmpty(currentOffsetSetting) && !isEmpty(assets)
        ? assets.map(asset => asset.asset_id)
        : currentOffsetSetting.map(offset => offset.selectedWellId),
    [currentOffsetSetting, assets]
  );

  const handlePadSelect = event =>
    dialogDispatch('SET_PAD_ID', {
      selectedPadIds: event.target.value,
      currentWellIds: currentOffsetIds,
      padsData: requestContext.padsData,
    });
  const handleWellSelect = event => dialogDispatch('SET_WELL_ID', event.target.value);
  const closeDialog = () => dialogDispatch('CLOSE_DIALOG');

  const { selectedPadIds, selectedWellIds } = dialogContext;

  const openDialog = () =>
    dialogDispatch('OPEN_DIALOG', {
      currentWellIds: currentOffsetIds,
      padsData: requestContext.padsData,
    });

  const handleSave = () => {
    const selectedWells = requestContext.wellsData.filter(well =>
      selectedWellIds.includes(well.asset_id)
    );

    const newOffsets = selectedWells.map(well => {
      const preSelectedWell = currentOffsetSetting.find(
        setting => setting.selectedWellId === Number(well.asset_id)
      );
      if (preSelectedWell) return preSelectedWell;

      return {
        selectedWellId: Number(well.asset_id),
        selectedWellName: well.name,
        selectedWellStatus: well.status,
        selectedStages: [],
        stages: {},
      };
    });

    closeDialog();
    onSave(newOffsets);
  };

  useEffect(() => {
    requestContext.companyId = companyId;
    requestDispatch('FETCH_PADS');
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!isEmpty(selectedPadIds)) {
      const selectedPadsData = requestContext.padsData.filter(pad =>
        selectedPadIds.includes(pad.id)
      );
      requestDispatch('FETCH_WELLS', selectedPadsData);
    }
  }, [selectedPadIds]); // eslint-disable-line

  const assetIds = new Set(assets.map(asset => Number(asset.asset_id)));

  return (
    <div>
      <Fab
        size="small"
        color="primary"
        classes={{ sizeSmall: classes.fabSmallBtn }}
        onClick={openDialog}
        disabled={requestState !== 'success'}
      >
        <Add className={classes.fabSmallBtnIcon} />
      </Fab>
      {requestState === 'success' && (
        <Dialog
          open={dialogState === 'open'}
          onBackdropClick={closeDialog}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle>Offset Wells</DialogTitle>
          <DialogContent>
            <FormControl margin="normal" fullWidth required>
              <InputLabel htmlFor="pad-select" shrink={!isEmpty(selectedPadIds)}>
                Pad
              </InputLabel>
              <Select
                multiple
                inputProps={{ name: 'pads', id: 'pad-select' }}
                value={selectedPadIds}
                onChange={handlePadSelect}
                renderValue={selected => `${selected.length} selected`}
              >
                {requestContext.padsData.map(pad => (
                  <MenuItem key={pad.id} value={pad.id}>
                    <Checkbox checked={selectedPadIds.includes(pad.id)} />
                    <ListItemText primary={pad.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="normal" disabled={isEmpty(selectedPadIds)} fullWidth required>
              <InputLabel htmlFor="wells" shrink={!isEmpty(selectedWellIds)}>
                Well
              </InputLabel>
              <Select
                multiple
                inputProps={{ name: 'wells', id: 'well-select' }}
                value={selectedWellIds}
                onChange={handleWellSelect}
                renderValue={selected => `${selected.length} selected`}
              >
                {requestContext.wellsData.map(well => {
                  const isMenuItemDisabled = assetIds.has(well.asset_id);
                  
                  return (
                    <MenuItem key={well.id} value={well.asset_id} disabled={isMenuItemDisabled}>
                      <Checkbox checked={selectedWellIds.includes(well.asset_id)} />
                      <ListItemText primary={well.name} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              disabled={isEmpty(selectedWellIds)}
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

PadOffsetsPicker.propTypes = {
  currentOffsetSetting: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSave: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
  assets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PadOffsetsPicker;
