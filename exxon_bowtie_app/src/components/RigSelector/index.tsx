import { FC, useState, ChangeEvent } from 'react';
import { FormControl, Select, InputLabel, MenuItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: 200,
  },
}));

export const RigSelector: FC = () => {
  const classes = useStyles();
  const [rig, setRig] = useState('rig');

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setRig(event.target.value as string);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="rig-select-label">Rig</InputLabel>
      <Select
        labelId="rig-select-label"
        data-testid="rig-select"
        id="rig-select"
        value={rig}
        onChange={handleChange}
      >
        <MenuItem value="rig">Rig Name</MenuItem>
      </Select>
    </FormControl>
  );
};
