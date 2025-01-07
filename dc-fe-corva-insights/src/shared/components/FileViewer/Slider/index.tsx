import { useEffect, useState } from 'react';

import { NavigationButton } from '../../NavigationButton';
import styles from './index.module.css';

type Props<Item> = {
  items: Item[];
  children: ((item: Item) => JSX.Element) | JSX.Element | undefined | null;
  defaultIndex: number;
  onChange?: (item: Item) => void;
  'data-testid'?: string;
};

export function FileViewerSlider<Item>({
  items,
  children,
  defaultIndex,
  onChange,
  'data-testid': dataTestId,
}: Props<Item>) {
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(defaultIndex);

  const currentItem = items[currentItemIndex];
  const isFirst = currentItemIndex === 0;
  const isLast = currentItemIndex === items.length - 1;

  const setNextItemIndex = () => {
    if (isLast) return;
    setCurrentItemIndex(index => index + 1);
  };

  const setPrevItemIndex = () => {
    if (isFirst) return;
    setCurrentItemIndex(index => index - 1);
  };

  useEffect(() => {
    onChange?.(currentItem);
  }, [currentItem]);

  return (
    <div className={styles.container}>
      <NavigationButton
        variant="left"
        onClick={setPrevItemIndex}
        disabled={isFirst}
        testId={`${dataTestId}_prevBtn`}
      />
      <div className={styles.content}>
        {typeof children === 'function' ? children(currentItem) : children}
      </div>
      <NavigationButton
        variant="right"
        onClick={setNextItemIndex}
        disabled={isLast}
        testId={`${dataTestId}_nextBtn`}
      />
    </div>
  );
}
