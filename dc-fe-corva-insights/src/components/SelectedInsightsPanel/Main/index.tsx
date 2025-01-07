import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import classNames from 'classnames';

import { useSelectedInsightsStore } from '@/contexts/selected-insights';
import { useFiltersStore } from '@/contexts/filters';
import { SELECTED_INSIGHTS_MODE } from '@/stores/selected-insights';
import { ListWithGradient } from '@/shared/components/ListWithGradient';

import { BlockContainer } from '../../Container';
import { InsightsGroup } from './Group';
import { InsightsList } from './List';
import styles from './index.module.css';

type Props = {
  gradientClassName?: string;
  className?: string;
};

export const SelectedInsightsMain: FC<Props> = observer(({ gradientClassName, className }) => {
  const filtersStore = useFiltersStore();
  const store = useSelectedInsightsStore();

  return (
    <BlockContainer isLoading={store.isLoading} isEmpty={store.isEmpty}>
      <ListWithGradient
        listClassName={classNames(styles.list, className)}
        gradientClassName={classNames(styles.gradient, gradientClassName)}
      >
        {store.mode === SELECTED_INSIGHTS_MODE.GROUP ? (
          <InsightsGroup insightsGroups={store.insightsGroups} />
        ) : (
          <InsightsList insights={store.insights} date={filtersStore.selectedDay} />
        )}
      </ListWithGradient>
    </BlockContainer>
  );
});

SelectedInsightsMain.displayName = 'SelectedInsightsMain';
