import styles from './index.module.css';

export const WeekDays = () => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.container}>
      {weekDays.map(day => (
        <div key={day} className={styles.day}>
          {day}
        </div>
      ))}
    </div>
  );
};
