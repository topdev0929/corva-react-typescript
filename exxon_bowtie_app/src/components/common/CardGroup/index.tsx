import { FC, ReactNode } from 'react';

import { styles } from './styles';

type CardGroupProps = {
  title: string;
  children: ReactNode;
  padding?: string;
  width?: string;
};

export const CardGroup: FC<CardGroupProps> = ({ title, children, padding, width }) => {
  return (
    <div style={{ ...styles.wrapper, padding, width }}>
      <div style={styles.title}>
        <p style={styles.titleText}>{title}</p>
      </div>
      <div style={styles.children}>{children}</div>
    </div>
  );
};
