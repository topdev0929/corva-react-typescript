import { createContext, FC, PropsWithChildren, useEffect, useState } from 'react';

import { FiltersStoreImpl, FiltersStore } from '@/stores/filters';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const FiltersContext = createContext<FiltersStore>();

type Props = {
  defaultDay?: string | Date;
};

export const FiltersProvider: FC<PropsWithChildren<Props>> = ({ children, defaultDay }) => {
  const [store] = useState(() => new FiltersStoreImpl());

  useEffect(() => {
    if (defaultDay) {
      store.setSelectedDay(new Date(defaultDay));
    }
  }, [defaultDay]);

  return <FiltersContext.Provider value={store}>{children}</FiltersContext.Provider>;
};
