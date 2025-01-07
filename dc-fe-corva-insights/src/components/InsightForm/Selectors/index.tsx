import { DateTimePicker } from '@corva/ui/components';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core';

import { ACTIVITY_TYPE, FIELD_SAMPLE_TYPE, INSIGHT_TYPE } from '@/entities/insight';
import { useInsightFormStore } from '@/contexts/insight-form';
import { CustomSelector } from '@/shared/components/CustomSelector';
import { useCommonDatePickerStyles } from '@/shared/styles';
import { Theme } from '@/shared/types';
import { VIEWS } from '@/constants';

import styles from './index.module.css';

export const useDatePickerStyles = makeStyles<Theme>(theme => ({
  dateTimePickerInput: {
    ...useCommonDatePickerStyles(theme),
  },
}));

export const InsightFormSelectors = observer(() => {
  const classes = useDatePickerStyles();
  const store = useInsightFormStore();

  return (
    <div className={styles.selectors}>
      <div className={styles.selector}>
        <CustomSelector<INSIGHT_TYPE>
          testId={`${VIEWS.INSIGHT_FORM}_typeSelector`}
          id="insight-type"
          label="Insight Type"
          options={store.typeOptions}
          value={store.type}
          handleChange={value => store.setType(value)}
        />
      </div>
      {store.checkIfShowSpecificField('activityType') && (
        <div className={styles.selector}>
          <CustomSelector<ACTIVITY_TYPE>
            testId={`${VIEWS.INSIGHT_FORM}_activityTypeSelector`}
            id="activity-type"
            label="Activity Type"
            options={store.activityTypeOptions}
            value={store.activityType}
            handleChange={value => store.setActivityType(value)}
          />
        </div>
      )}
      {store.checkIfShowSpecificField('fieldSampleType') && (
        <div className={styles.selector}>
          <CustomSelector<FIELD_SAMPLE_TYPE>
            testId={`${VIEWS.INSIGHT_FORM}_fieldSampleTypeSelector`}
            id="field_sample-type"
            label="Field Sample Type"
            options={store.fieldSampleTypeOptions}
            value={store.fieldSampleType}
            handleChange={value => store.setFieldSampleType(value)}
          />
        </div>
      )}
      <div className={styles.selector}>
        <DateTimePicker
          data-testid={`${VIEWS.INSIGHT_FORM}_datetimePicker`}
          fullWidth
          label="Date / Time"
          format="MM/DD/YY, hh:mm a"
          onChange={value => store.setDate(value && value.toDate())}
          value={store.date}
          className={classes.dateTimePickerInput}
        />
      </div>
    </div>
  );
});

InsightFormSelectors.displayName = 'InsightFormSelectors';
