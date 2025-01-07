import { FC, PropsWithChildren, ReactNode } from 'react';
import { Tooltip } from '@corva/ui/components';
import classNames from 'classnames';

import styles from './index.module.css';

type Props = {
  color?: string;
  className?: string;
  tooltip?: {
    content: ReactNode;
    placement?: 'top' | 'right' | 'bottom' | 'left';
  };
  testId?: string;
};

export const Tile: FC<PropsWithChildren<Props>> = ({
  children,
  color,
  tooltip,
  className,
  testId,
}) => {
  return (
    <Tooltip title={tooltip?.content} placement={tooltip?.placement}>
      <div
        className={classNames(styles.container, className)}
        style={{ backgroundColor: color }}
        data-testid={testId}
      >
        {children}
      </div>
    </Tooltip>
  );
};
