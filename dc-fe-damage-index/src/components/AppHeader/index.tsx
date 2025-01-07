import { AppHeader } from '@corva/ui/components';
import { useTheme } from '@material-ui/core';

import { Theme } from '@/shared/types';
import OffsetPicker from '../OffsetPicker';

import logo from '../../assets/logo.svg';
import darkLogo from '../../assets/dark-logo.svg';
import styles from './index.module.css';

export const CustomAppHeader = ({ appHeaderProps }) => {
  const theme = useTheme<Theme>();
  return (
    <header className={styles.header}>
      <img className={styles.headerLogo} src={theme.isLightTheme ? darkLogo : logo} alt="Logo" />
      <div className={styles.headerSplit} />
      <div className={styles.headerContent}>
        <AppHeader {...appHeaderProps}>
          <OffsetPicker
            currentUser={appHeaderProps.currentUser}
            well={appHeaderProps.well}
          />
        </AppHeader>
        <span className={styles.headerSubtitle}>Description</span>
      </div>
    </header>
  );
};
