import { forwardRef, PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './index.module.css';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  className?: string;
  listClassName?: string;
  gradientClassName?: string;
};

export const ListWithGradient = forwardRef<HTMLDivElement | null, PropsWithChildren<Props>>(
  ({ children, className, listClassName, gradientClassName, ...props }, ref) => {
    return (
      <div {...props} className={classNames(styles.container, className)} ref={ref}>
        <div className={classNames(styles.gradient, gradientClassName)} />
        <div className={classNames(styles.list, listClassName)}>{children}</div>
        <div className={classNames(styles.gradient, styles.bottom, gradientClassName)} />
      </div>
    );
  }
);
