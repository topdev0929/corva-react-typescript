import { observer } from 'mobx-react-lite';
import { Button } from '@corva/ui/components';
import { makeStyles } from '@material-ui/core';

import { useSelectedInsightsStore } from '@/contexts/selected-insights';
import { Theme } from '@/shared/types';
import { VIEWS } from '@/constants';

import styles from './index.module.css';

const TABS = ['all', 'docs', 'photos'] as const;

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    textTransform: 'capitalize',
    padding: '4px 8px',
    minWidth: 0,
    boxShadow: 'none',
    maxHeight: 22,
    fontWeight: 400,
    fontSize: 12,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.text1,
      boxShadow: 'none',
    },
  },
  contained: {
    backgroundColor: theme.palette.background.b7,
    color: theme.palette.primary.text1,
    '&:hover': {
      backgroundColor: theme.palette.background.b7,
    },
  },
}));

export const SelectedInsightsTabBar = observer(() => {
  const classes = useStyles();
  const store = useSelectedInsightsStore();

  const onSelectTab = (event, tab) => {
    event.stopPropagation();
    event.preventDefault();
    store.setTab(tab);
  };

  return (
    <div className={styles.container}>
      {TABS.map(tab => (
        <Button
          data-testid={`${VIEWS.DAY_PANEL}_tab_${tab}`}
          classes={classes}
          key={tab}
          variant={store.tab === tab ? 'contained' : 'text'}
          size="small"
          onClick={event => onSelectTab(event, tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
});

SelectedInsightsTabBar.displayName = 'SelectedInsightsTabBar';
