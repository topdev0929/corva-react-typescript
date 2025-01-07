import { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import LineChart from './Charts/LineChart';
import DataLoadingIndicator from './DataLoadingIndicator';

import SettingsContext from '../SettingsContext';
import DataContext from '../DataContext';

import styles from './ChartContainer.css';

const ChartContainer = ({ traces, trackIndex }) => {
  const { horizontal } = useContext(SettingsContext);
  const { isLoading } = useContext(DataContext);

  return (
    <div
      className={classNames(styles.container, {
        [styles.horizontal]: horizontal,
        [styles.first]: trackIndex === 0,
      })}
    >
      <LineChart trackIndex={trackIndex} traceSettings={traces} />
      {isLoading && <DataLoadingIndicator />}
    </div>
  );
};

ChartContainer.propTypes = {
  traces: PropTypes.arrayOf(
    PropTypes.shape({
      dashStyle: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      key: PropTypes.string,
      color: PropTypes.string,
      name: PropTypes.string,
      traceType: PropTypes.string.isRequired,
      unit: PropTypes.string,
      lineWidth: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
  trackIndex: PropTypes.number.isRequired,
};

export default ChartContainer;
