import { FC, useMemo } from 'react';
import classnames from 'classnames';

import { FIT_IN_STATUS, getFitInStatus } from '@/entities/optimization-parameter';
import { formatNumberPrecision } from '@/shared/utils';

import { CellProps } from '../Table/types';
import styles from './index.module.css';

type Props = CellProps;

export const FitInValue: FC<Props> = ({ fitInParameters }) => {
  const fitInStatus = useMemo(() => getFitInStatus(fitInParameters), [fitInParameters]);

  const icon = useMemo(() => {
    switch (fitInStatus) {
      case FIT_IN_STATUS.SAFE:
        return (
          <svg
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.72667 7.05333L0.946666 4.27333L0 5.21333L3.72667 8.94L11.7267 0.94L10.7867 0L3.72667 7.05333Z"
              fill="#4CAF50"
            />
          </svg>
        );
      case FIT_IN_STATUS.WARN:
        return (
          <svg
            width="16"
            height="13"
            viewBox="0 0 16 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.393311 13H15.06L7.72664 0.333313L0.393311 13ZM8.39331 11H7.05998V9.66665H8.39331V11ZM8.39331 8.33331H7.05998V5.66665H8.39331V8.33331Z"
              fill="#FFC107"
            />
          </svg>
        );
      case FIT_IN_STATUS.DANGER:
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.72648 0.333313C3.04648 0.333313 0.0598145 3.31998 0.0598145 6.99998C0.0598145 10.68 3.04648 13.6666 6.72648 13.6666C10.4065 13.6666 13.3931 10.68 13.3931 6.99998C13.3931 3.31998 10.4065 0.333313 6.72648 0.333313ZM7.39315 10.3333H6.05981V8.99998H7.39315V10.3333ZM7.39315 7.66665H6.05981V3.66665H7.39315V7.66665Z"
              fill="#F44336"
            />
          </svg>
        );
      default:
        return null;
    }
  }, [fitInStatus]);

  return (
    <span className={styles.container}>
      <p
        className={classnames(styles.value, {
          [styles.warnValue]: fitInStatus === FIT_IN_STATUS.WARN,
          [styles.dangerValue]: fitInStatus === FIT_IN_STATUS.DANGER,
        })}
      >
        {formatNumberPrecision(fitInParameters.real, 1)}
      </p>
      {icon}
    </span>
  );
};
