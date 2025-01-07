import { useEffect } from 'react';
import { func, number, oneOf, string, shape } from 'prop-types';
import useTinyStateMachine from 'use-tiny-state-machine';
import { isNull, get, noop, range, isEmpty, last } from 'lodash';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { getAppStorage } from '~/clients/jsonApi';

import { OffsetWellChip } from '~/components';

const useStyles = makeStyles({
  dialogPaper: {
    width: '75%',
    maxWidth: 420,
  },
});

function fetchStageAction({ dispatch }, offsetWellId) {
  getAppStorage('corva', 'completion.wits', offsetWellId, {
    limit: 1,
    sort: '{timestamp:-1}',
  })
    .then(response => (isEmpty(response) ? null : get(last(response), 'stage_number', null)))
    .then(lastStageNumber => dispatch('SUCCESS', lastStageNumber))
    .catch(error => {
      throw new Error(error.message);
    });
}

const stagesStateChart = {
  id: 'stages',
  initial: 'idle',
  context: {
    lastStageNumber: null,
    error: null,
  },
  states: {
    idle: {
      on: {
        FETCH_STAGES: {
          target: 'pending',
          action: fetchStageAction,
        },
      },
    },
    pending: {
      on: {
        SUCCESS: {
          target: 'success',
          beforeStateChange: ({ updateContext }, lastStageNumber) =>
            updateContext(currentContext => ({ ...currentContext, lastStageNumber })),
        },
        FAILURE: {
          target: 'failure',
          beforeStateChange: (_, error) => {
            throw new Error(error.message);
          },
        },
      },
    },
  },
};

const dialogStateChart = ({
  stages: currentStagesData = {},
  selectedStages: currentSelectedStages = [],
}) => ({
  id: 'dialog',
  initial: 'closed',
  context: {
    selectedStages: currentSelectedStages,
    stagesData: currentStagesData,
  },
  states: {
    closed: {
      on: {
        OPEN_DIALOG: {
          target: 'open',
        },
      },
    },
    open: {
      on: {
        CLOSE_DIALOG: {
          target: 'closed',
        },
        SET_SELECTED_STAGES: {
          target: 'open',
          beforeStateChange: ({ updateContext }, selectedStages) =>
            updateContext(currentContext => ({
              ...currentContext,
              selectedStages,
              stagesData: selectedStages.reduce(
                (stages, stage) => ({
                  ...stages,
                  [stage]: {
                    lineStyle: 'dotted',
                    lineWidth: 2,
                  },
                }),
                {}
              ),
            })),
        },
        SET_SELECTED_LINE_STYLE: {
          target: 'open',
          beforeStateChange: ({ updateContext }, { stage, selectedLineStyle }) =>
            updateContext(currentContext => ({
              ...currentContext,
              stagesData: {
                ...currentContext.stagesData,
                [stage]: {
                  ...currentContext.stagesData[stage],
                  lineStyle: selectedLineStyle,
                },
              },
            })),
        },
        SET_SELECTED_LINE_WIDTH: {
          target: 'open',
          beforeStateChange: ({ updateContext }, { stage, selectedLineWidth }) =>
            updateContext(currentContext => ({
              ...currentContext,
              stagesData: {
                ...currentContext.stagesData,
                [stage]: {
                  ...currentContext.stagesData[stage],
                  lineWidth: Number(selectedLineWidth),
                },
              },
            })),
        },
      },
    },
  },
});

const StagesSelector = ({ onSave, onDelete, offset }) => {
  const classes = useStyles();
  const {
    state: requestState,
    dispatch: requestDispatch,
    context: requestContext,
  } = useTinyStateMachine(stagesStateChart);
  const {
    state: dialogState,
    dispatch: dialogDispatch,
    context: dialogContext,
  } = useTinyStateMachine(dialogStateChart(offset));

  const handleStagesSelect = event => dialogDispatch('SET_SELECTED_STAGES', event.target.value);

  const handleLineStyleChange = stage => event =>
    dialogDispatch('SET_SELECTED_LINE_STYLE', { stage, selectedLineStyle: event.target.value });

  const handleLineWidthChange = stage => event =>
    dialogDispatch('SET_SELECTED_LINE_WIDTH', { stage, selectedLineWidth: event.target.value });

  const openDialog = () => dialogDispatch('OPEN_DIALOG');
  const closeDialog = () => dialogDispatch('CLOSE_DIALOG');

  const offsetWellId = offset.selectedWellId;

  const handleSave = () => {
    const updatedOffset = {
      ...offset,
      stages: dialogContext.stagesData,
      selectedStages: dialogContext.selectedStages,
    };

    closeDialog();
    onSave(updatedOffset);
  };

  useEffect(() => {
    requestDispatch('FETCH_STAGES', offsetWellId);
  }, []); // eslint-disable-line

  const isStageDataEmpty = isNull(requestContext.lastStageNumber);

  return (
    <>
      <OffsetWellChip
        title={offset.selectedWellName}
        onClick={isStageDataEmpty ? noop : openDialog}
        onRemoveOffsetWell={onDelete}
        wellId={offsetWellId}
        rigName=''
      />

      {requestState === 'success' && (
        <Dialog
          open={dialogState === 'open'}
          onBackdropClick={closeDialog}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle>Offset Well Stages</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={16}>
              <Grid item>
                <FormControl margin="normal" fullWidth required>
                  <InputLabel htmlFor="stages-multi-select">Stages</InputLabel>
                  <Select
                    inputProps={{ name: 'stages', id: 'stages-multi-select' }}
                    value={dialogContext.selectedStages}
                    renderValue={selected => `${selected.length} stages selected`}
                    onChange={handleStagesSelect}
                    multiple
                  >
                    {range(1, requestContext.lastStageNumber + 1).map(stage => (
                      <MenuItem key={stage} value={stage}>
                        <Checkbox checked={dialogContext.selectedStages.includes(stage)} />
                        <ListItemText primary={stage} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {dialogContext.selectedStages
                .sort((a, b) => a - b)
                .map(stage => (
                  <Grid item key={stage}>
                    <Typography variant="subtitle1">Stage {stage}</Typography>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" required>
                        Line Style
                      </FormLabel>
                      <RadioGroup
                        name="line-style"
                        value={get(dialogContext, ['stagesData', stage, 'lineStyle'], 'dotted')}
                        onChange={handleLineStyleChange(stage)}
                        row
                      >
                        <FormControlLabel value="dotted" control={<Radio />} label="Dotted" />
                        <FormControlLabel value="dashed" control={<Radio />} label="Dashed" />
                        <FormControlLabel value="solid" control={<Radio />} label="Solid" />
                      </RadioGroup>
                    </FormControl>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" required>
                        Line Width
                      </FormLabel>
                      <RadioGroup
                        name="line-width"
                        value={String(get(dialogContext, ['stagesData', stage, 'lineWidth'], '2'))}
                        onChange={handleLineWidthChange(stage)}
                        row
                      >
                        <FormControlLabel value={String(1)} control={<Radio />} label="Thin" />
                        <FormControlLabel value={String(2)} control={<Radio />} label="Normal" />
                        <FormControlLabel value={String(4)} control={<Radio />} label="Thick" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

StagesSelector.propTypes = {
  onSave: func.isRequired,
  onDelete: func.isRequired,
  offset: shape({
    selectedWellId: number,
    selectedWellName: string,
    selectedWellStatus: oneOf(['active', 'idle', 'complete', 'paused', 'unknown']),
  }).isRequired,
};

export default StagesSelector;
