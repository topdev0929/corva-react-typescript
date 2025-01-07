import { func, bool } from 'prop-types';
import { useTheme } from '@material-ui/core';
import classNames from 'classnames';

import styles from './ComparisonTable.css';

const ComparisonHeader = ({ renderStages, renderSortIcon, handleSortClick, showBar }) => {
  const theme = useTheme();
  return (
    <div
      className={classNames(styles.comparisonHeader, {
        [styles.comparisonHeaderLightTheme]: theme.isLightTheme,
      })}
    >
      <div
        className={styles.comparisonNameCol}
        onClick={handleSortClick && (() => handleSortClick('key'))}
      >
        Parameter
        {renderSortIcon && <div className={styles.comparisonSortIcon}>{renderSortIcon('key')}</div>}
      </div>
      <div
        className={styles.comparisonDesignCol}
        onClick={handleSortClick && (() => handleSortClick('design'))}
      >
        Design
        {renderSortIcon && (
          <div className={styles.comparisonSortIcon}>{renderSortIcon('design')}</div>
        )}
      </div>
      <div
        className={styles.comparisonActualCol}
        onClick={handleSortClick && (() => handleSortClick('actual'))}
      >
        Straps
        {renderSortIcon && (
          <div className={styles.comparisonSortIcon}>{renderSortIcon('actual')}</div>
        )}
      </div>
      <div className={styles.comparisonActualCol}>Calc</div>
      <div className={styles.comparisonActualCol}>Variance %</div>
      <div className={styles.comparisonActualCol}>% from design</div>
      {showBar && (
        <div className={styles.comparisonChartCol}>{renderStages ? renderStages() : ''}</div>
      )}
    </div>
  );
};

ComparisonHeader.propTypes = {
  renderStages: func,
  handleSortClick: func,
  renderSortIcon: func,
  showBar: bool,
};

ComparisonHeader.defaultProps = {
  renderStages: undefined,
  handleSortClick: undefined,
  renderSortIcon: undefined,
  showBar: true,
};

export default ComparisonHeader;
