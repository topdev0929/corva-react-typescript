import { FC } from 'react';
import { AppHeader } from '@corva/ui/components';

import logo from '../../assets/logo.svg';

import { styles } from './styles';

type CustomAppHeaderProps = {
  appHeaderProps: {
    [key: string]: any;
    app: any;
  };
};

export const CustomAppHeader: FC<CustomAppHeaderProps> = ({ appHeaderProps }) => {
  return (
    <header style={styles.header}>
      <img style={styles.headerLogo} src={logo} alt="Logo" />
      <div style={styles.headerSplit} />
      <div style={styles.headerContent}>
        <AppHeader {...appHeaderProps} />
      </div>
    </header>
  );
};
