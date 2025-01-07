import { useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual, sortBy } from 'lodash';
import { makeStyles } from '@material-ui/core';
import { OffsetWellPickerV4, OffsetWellButton } from '@corva/ui/components';

import { MAX_OFFSET_SIZE } from '~/constants';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

function OffsetPicker({ currentUser, well, appSettings, updateAppSettings }) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const { offset_picker } = appSettings;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const onSave = (newSettings, offsetWells) => {
    if (!isEqual(sortBy(offset_picker?.selectedWellIds), sortBy(newSettings?.selectedWellIds))) {
      updateAppSettings('offset_picker', {
        ...newSettings,
        // eslint-disable-next-line react/prop-types
        offset_wells: offsetWells.map(well => ({ id: well.id, name: well.name })),
      });
    }
    handleClose();
  };

  return (
    <div className={classes.root}>
      <OffsetWellButton
        wells={offset_picker?.selectedWellIds?.filter(id => id !== well.asset_id) || []}
        onClick={handleOpen}
        expanded={false}
      />

      <OffsetWellPickerV4
        open={isOpen}
        isWDUser={false}
        defaultSubjectWell={{ companyId: +well.companyId, asset_id: well.asset_id }}
        currentUser={currentUser}
        offsetSettings={appSettings.offset_picker}
        onClose={handleClose}
        onSave={onSave}
        maxOffsetSize={MAX_OFFSET_SIZE}
        localMaxOffsetSize={MAX_OFFSET_SIZE}
        syncAutoEnabled
      />
    </div>
  );
}

OffsetPicker.propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  well: PropTypes.shape({
    asset_id: PropTypes.number,
    companyId: PropTypes.string,
  }).isRequired,
  appSettings: PropTypes.shape({
    offset_picker: PropTypes.shape({ selectedWellIds: PropTypes.arrayOf(PropTypes.number) }),
  }).isRequired,
  updateAppSettings: PropTypes.func.isRequired,
};

export default OffsetPicker;
