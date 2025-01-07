import { memo, useState, useEffect, useContext } from 'react';
import { uniq } from 'lodash';
import { makeStyles, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

import { isMobileDetected } from '~/utils/mobileDetect';
import { RealTimeBoxEditDialogProps } from '../types';
import Modal from '~/components/Modal/Modal';
import Button from '~/components/Button';
import RealTimeSidebarContext from '../RealTimeSidebarContext';

const useStyles = makeStyles({
  selectFormControl: { width: '80%', marginRight: '1rem' },
  cancelButton: {
    margin: '0 16px 0 auto',
  },
});

function RealTimeBoxEditDialog(props: RealTimeBoxEditDialogProps) {
  const { isDialogOpen, paramToEdit, handleCloseRealTimeDialog } = props;
  const {
    onAppSettingChange,
    appSettings,
    assetKey,
    realTimeTypes,
    setting,
    handleChangeParamToEdit,
  } = useContext(RealTimeSidebarContext);

  const classes = useStyles();

  const onAppRtValuesSettingChange = value => {
    onAppSettingChange('rtValuesSetting', {
      ...appSettings.rtValuesSetting,
      [assetKey]: value,
    });
  };

  const [selectedParam, setSelectedParam] = useState(paramToEdit);

  useEffect(() => {
    setSelectedParam(paramToEdit);
  }, [paramToEdit]);

  const handleSave = () => {
    let newSetting;
    if (!paramToEdit) {
      if (setting.find(item => item === selectedParam)) {
        handleCloseRealTimeDialog();
        return;
      }
      newSetting = [selectedParam, ...setting];
    } else {
      newSetting = setting.map(item => {
        return item === paramToEdit ? selectedParam : item;
      });
    }

    // NOTE: remove duplicates
    newSetting = uniq(newSetting);

    onAppRtValuesSettingChange(newSetting);
    handleChangeParamToEdit('');
    handleCloseRealTimeDialog();
  };

  const handleDelete = () => {
    const newSetting = setting.filter(item => item !== paramToEdit);
    onAppRtValuesSettingChange(newSetting);
    handleChangeParamToEdit('');
    handleCloseRealTimeDialog();
  };

  const onParamChange = e => {
    const { value } = e.target;
    setSelectedParam(String(e.target.value));
  };

  return (
    <Modal
      open={isDialogOpen}
      onClose={handleCloseRealTimeDialog}
      title="Add/Edit Real-Time Parameter"
      size={isMobileDetected ? 'extraLarge' : 'medium'}
      actions={
        <>
          <Button
            color="primary"
            classes={{ root: classes.cancelButton }}
            onClick={handleCloseRealTimeDialog}
          >
            Cancel
          </Button>
          {paramToEdit && (
            <Button color="primary" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variation="primary" onClick={handleSave} disabled={!selectedParam}>
            Save
          </Button>
        </>
      }
    >
      <>
        <FormControl classes={{ root: classes.selectFormControl }}>
          <InputLabel htmlFor="parameter">Parameter</InputLabel>
          <Select
            value={selectedParam}
            inputProps={{ name: 'parameter', id: 'parameter' }}
            onChange={onParamChange}
          >
            {realTimeTypes.map(rtType => (
              <MenuItem value={rtType.key} key={rtType.key} disabled={setting.includes(rtType.key)}>
                {rtType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    </Modal>
  );
}

export default memo(RealTimeBoxEditDialog);
