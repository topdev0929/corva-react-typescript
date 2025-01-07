import { makeStyles } from '@material-ui/core';
import { Button } from '@corva/ui/components';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { useOPStore } from '@/contexts/optimization-parameters';
import { VIEW_TYPES } from '@/stores/optimization-parameters';
import { Theme } from '@/shared/types';

import styles from './index.module.css';

const useStyles = makeStyles<Theme>(theme => ({
  button: {
    minWidth: 46,
    maxWidth: 46,
    textTransform: 'capitalize',
    fontSize: 12,
    fontWeight: 400,
    padding: '4px 8px',
  },
  buttonSelected: {
    fontWeight: 700,
    color: theme.palette.primary.text1,
    background: theme.palette.background.b11,
  },
}));

export const ViewSelector = observer(() => {
  const classes = useStyles();
  const store = useOPStore();

  const isChartView = store.viewType === VIEW_TYPES.CHART;
  const isTableView = store.viewType === VIEW_TYPES.TABLE;

  const onSetChartView = useCallback(() => store.setChartView(), []);
  const onSetTableView = useCallback(() => store.setTableView(), []);

  return (
    <div className={styles.container}>
      <Button
        className={classnames(classes.button, { [classes.buttonSelected]: isChartView })}
        size="small"
        onClick={onSetChartView}
      >
        Chart
      </Button>
      <Button
        className={classnames(classes.button, { [classes.buttonSelected]: isTableView })}
        size="small"
        onClick={onSetTableView}
      >
        Table
      </Button>
    </div>
  );
});

ViewSelector.displayName = 'ViewSelector';
