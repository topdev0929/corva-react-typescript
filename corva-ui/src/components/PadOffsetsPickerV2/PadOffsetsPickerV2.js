import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import { Modal } from '~/components';

import { useDialogState } from './useDialogState';

const useStyles = makeStyles({
  cancelButton: {
    marginLeft: 'auto',
    marginRight: 16,
  },
});

const PadOffsetsPickerV2 = ({
  onSave,
  opened,
  currentOffsetSetting,
  assets,
  companyId,
  onClose,
}) => {
  const classes = useStyles();
  const { requestState, dialogState, setDialogState } = useDialogState({
    opened,
    companyId,
    currentOffsetSetting,
    assets,
  });

  const handlePadSelect = event => {
    setDialogState(prev => ({
      ...prev,
      selectedPadIds: event.target.value,
    }));
  };
  
  const handleWellSelect = event => {
    setDialogState(prev => ({ ...prev, selectedWellIds: event.target.value }));
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, status: 'closed' }));
    onClose();
  };

  const handleSave = () => {
    const selectedWells = requestState.wellsData.filter(well =>
      dialogState.selectedWellIds.includes(well.asset_id)
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

  const assetIds = new Set(assets.map(asset => Number(asset.asset_id)));

  return (
    <>
      {requestState.status === 'success' && (
        <Modal
          open={dialogState.status === 'open'}
          onClose={closeDialog}
          title="Offset Wells"
          size="small"
          actions={
            <>
              <Button onClick={closeDialog} className={classes.cancelButton}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={isEmpty(dialogState.selectedWellIds)}
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          }
        >
          <FormControl margin="normal" fullWidth required>
            <InputLabel htmlFor="pad-select" shrink={!isEmpty(dialogState.selectedPadIds)}>
              Pad
            </InputLabel>
            <Select
              multiple
              inputProps={{ name: 'pads', id: 'pad-select' }}
              value={dialogState.selectedPadIds}
              onChange={handlePadSelect}
              renderValue={selected => `${selected.length} selected`}
            >
              {requestState.padsData.map(pad => (
                <MenuItem key={pad.id} value={pad.id}>
                  <Checkbox checked={dialogState.selectedPadIds.includes(pad.id)} />
                  <ListItemText primary={pad.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            margin="normal"
            disabled={isEmpty(dialogState.selectedPadIds)}
            fullWidth
            required
          >
            <InputLabel htmlFor="wells" shrink={!isEmpty(dialogState.selectedWellIds)}>
              Well
            </InputLabel>
            <Select
              multiple
              inputProps={{ name: 'wells', id: 'well-select' }}
              value={dialogState.selectedWellIds}
              onChange={handleWellSelect}
              renderValue={selected => `${selected.length} selected`}
            >
              {requestState.wellsData.map(well => {
                const isMenuItemDisabled = assetIds.has(well.asset_id);

                return (
                  <MenuItem key={well.id} value={well.asset_id} disabled={isMenuItemDisabled}>
                    <Checkbox checked={dialogState.selectedWellIds.includes(well.asset_id)} />
                    <ListItemText primary={well.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Modal>
      )}
    </>
  );
};

PadOffsetsPickerV2.propTypes = {
  opened: PropTypes.bool.isRequired,
  currentOffsetSetting: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
  assets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PadOffsetsPickerV2;
