import { FC } from 'react';
import { DateTimePicker } from '@corva/ui/components';
import { Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';

import styles from './index.module.css';

type Props = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
};

export const Selectors: FC<Props> = ({ date, setDate }) => {
  return (
    <div className={styles.selectors}>
      <div className={styles.selector}>
        <FormControl className={styles.selector}>
          <InputLabel id="Insight-Type">Insight Type</InputLabel>
          <Select labelId="Insight-Type">
            <MenuItem value={0} />
          </Select>
        </FormControl>
      </div>
      <div className={styles.selector}>
        <DateTimePicker
          data-testid="datetimePicker"
          fullWidth
          label="Date / Time"
          format="MM/DD/YY, hh:mm"
          onChange={value => setDate(value.toDate())}
          value={date}
          // className={classes.dateTimePickerInput}
        />
      </div>
    </div>
  );
};
