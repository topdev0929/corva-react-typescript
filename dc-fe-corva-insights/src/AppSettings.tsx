import { DatePicker } from '@corva/ui/components';
import { makeStyles } from '@material-ui/core';

import { Theme } from '@/shared/types';
import { useCommonDatePickerStyles } from '@/shared/styles';
import { VIEWS } from '@/constants';

export const useStyles = makeStyles<Theme>(theme => ({
  datePicker: {
    ...useCommonDatePickerStyles(theme),
    maxWidth: 252,
    marginTop: 8,
  },
}));

const AppSettings = ({ settings, onSettingChange }): JSX.Element => {
  const classes = useStyles();

  return (
    <div>
      <DatePicker
        label="Project Start Date"
        emptyLabel=""
        format="MM/DD/YY"
        onChange={value => onSettingChange('projectStartDate', value?.toDate())}
        value={settings.projectStartDate || null}
        data-testid={`${VIEWS.APP_SETTINGS}_projectStartDate`}
        className={classes.datePicker}
        InputProps={{
          inputProps: {
            'data-testid': `${VIEWS.APP_SETTINGS}_projectStartDate_input`,
          },
        }}
      />
    </div>
  );
};

// Important: Do not change root component default export (AppSettings.js). Use it as container
//  for your App Settings. It's required to make build and zip scripts work as expected;
export default AppSettings;
