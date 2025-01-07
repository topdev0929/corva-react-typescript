import styles from './EmptyChart.css';

const EmptyChart = () => (
  <div className={styles.container}>
    <div className={styles.yAxis} />
    <div className={styles.xAxis} />
    <div className={styles.xAxis} />
    <div className={styles.xAxis} />
  </div>
)

export default EmptyChart;