import { FullScreenToggle } from './FullScreenToggle';
import styles from './index.module.css';

export const Settings = () => {
  return (
    <div className={styles.container}>
      <FullScreenToggle />
    </div>
  );
};
