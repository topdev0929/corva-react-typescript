import { DatePicker, Button } from '@corva/ui/components';
import { observer } from 'mobx-react-lite';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core';

import { FC } from 'react';
import { INSIGHT_TYPE } from '@/entities/insight';
import { useFiltersStore } from '@/contexts/filters';
import { useGlobalStore } from '@/contexts/global';
import { CustomSelector } from '@/shared/components/CustomSelector';
import { useCommonDatePickerStyles } from '@/shared/styles';
import { Theme } from '@/shared/types';
import { VIEWS } from '@/constants';

export const useDatePickerStyles = makeStyles<Theme>(theme => ({
  datePicker: {
    ...useCommonDatePickerStyles(theme),
  },
}));

type Props = {
  onRangeSet?: () => void;
};

export const FiltersContent: FC<Props> = observer(({ onRangeSet }) => {
  const classes = useDatePickerStyles();
  const globalStore = useGlobalStore();
  const store = useFiltersStore();

  const tryToOpenInsightsDetails = () => {
    if (store.range) {
      globalStore.openFullscreenInsightsDetails();
      onRangeSet?.();
    }
  };

  const onChangeStartDate = (value: Date | null) => {
    store.setStartDate(value);
    tryToOpenInsightsDetails();
  };

  const onChangeEndDate = (value: Date | null) => {
    store.setEndDate(value);
    tryToOpenInsightsDetails();
  };

  return (
    <>
      <CustomSelector<INSIGHT_TYPE>
        multiple
        id="insight-type"
        label="Insight Type"
        options={store.typeOptions}
        value={store.types}
        handleChange={value => store.setTypes(value)}
        testId={`${VIEWS.HEADER}_filter_insightType`}
      />
      <DatePicker
        label="Start Date"
        emptyLabel=""
        format="MM/DD/YY"
        onChange={value => onChangeStartDate(value?.toDate())}
        value={store.startDate}
        maxDate={store.endDate || undefined}
        maxDateMessage=""
        invalidDateMessage=""
        data-testid={`${VIEWS.HEADER}_filter_dateStart`}
        className={classes.datePicker}
        InputProps={{
          inputProps: {
            'data-testid': `${VIEWS.HEADER}_filter_dateStart_input`,
          },
        }}
      />
      <DatePicker
        label="End Date"
        emptyLabel=""
        format="MM/DD/YY"
        onChange={value => onChangeEndDate(value?.toDate())}
        minDateMessage=""
        invalidDateMessage=""
        value={store.endDate}
        data-testid={`${VIEWS.HEADER}_filter_dateEnd`}
        className={classes.datePicker}
        InputProps={{
          inputProps: {
            'data-testid': `${VIEWS.HEADER}_filter_dateEnd_input`,
          },
        }}
      />
      {!!store.range && (
        <Button
          onClick={() => store.resetRange()}
          startIcon={<CloseIcon />}
          data-testid={`${VIEWS.HEADER}_filter_resetBtn`}
        >
          Reset
        </Button>
      )}
    </>
  );
});

FiltersContent.displayName = 'FiltersContent';
