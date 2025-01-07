import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { OffsetWellPickerV4, OffsetWellButton } from '@corva/ui/components';

import { useFiltersStore } from '@/contexts/filters';
import { MAX_OFFSET_SIZE } from '@/constants';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

function OffsetPicker({ currentUser, well }) {
  const classes = useStyles();
  const store = useFiltersStore();
  const [isOpen, setIsOpen] = useState(false);

  const filters = {
    id: store.wellsOptions.map(option => option.value)
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const onSave = (newSettings: { selectedWellIds: number[] }) => {
    store.setSelectedWellsId(newSettings.selectedWellIds);
    handleClose();
  };

  return (
    <div className={classes.root}>
      <OffsetWellButton
        wells={store.selectedWellsId?.filter(id => id !== well.asset_id) || []}
        onClick={handleOpen}
        expanded={false}
      />

      <OffsetWellPickerV4
        open={isOpen}
        isWDUser={false}
        defaultSubjectWell={{ companyId: +well.companyId, asset_id: well.asset_id }}
        currentUser={currentUser}
        offsetSettings={{filters, selectedWellIds: store.selectedWellsId ?? []}}
        onClose={handleClose}
        onSave={onSave}
        maxOffsetSize={MAX_OFFSET_SIZE}
        localMaxOffsetSize={MAX_OFFSET_SIZE}
      />
    </div>
  );
}

export default OffsetPicker;
