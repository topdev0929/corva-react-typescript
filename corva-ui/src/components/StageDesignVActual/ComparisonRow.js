import classNames from 'classnames';
import { shape, number, bool, string } from 'prop-types';
import { useTheme } from '@material-ui/core';

import { getUnitDisplay } from '~/utils/convert';
import {
  getElemActualColor,
  getDifference,
  getFormattedValue,
  getIsGreaterThanTenPercent,
} from '~/utils/StageDesignVActualUtils';
import { CHEMICALS_TYPES } from '~/constants/completion';

import ComparisonBar from './ComparisonBar';

import styles from './ComparisonTable.css';

const PAGE_NAME = 'comparisonRow';

const ComparisonRow = ({
  rowKey,
  label,
  elemKey,
  unitType,
  elemMax,
  summaries,
  showBar,
  viewMode,
}) => {
  const theme = useTheme();
  const { designSummary, actualSummary, predictionSummary } = summaries;

  let designVal = designSummary && designSummary[rowKey];
  let actualVal = actualSummary && actualSummary[rowKey];
  let actualRTVal = predictionSummary && predictionSummary[rowKey];
  const unitDisplay = unitType ? getUnitDisplay(unitType) : '';
  const actualColor = getElemActualColor(rowKey, elemKey);

  if (elemKey) {
    designVal = designVal && designVal[elemKey] && designVal[elemKey].amount;
    actualVal = actualVal && actualVal[elemKey] && actualVal[elemKey].amount;
  }

  if (rowKey === 'volumeChemicals' || rowKey === 'massChemicals') {
    const chemicalElement = CHEMICALS_TYPES.find(type => type.name === elemKey) || {};
    const elemKeyByName = chemicalElement.key || null;
    actualRTVal = predictionSummary[elemKeyByName];
  }

  if (rowKey === 'flush_volume') {
    designVal = predictionSummary ? predictionSummary.flush_volume_design : 0;
  }

  const varience = actualRTVal ? ((actualRTVal - actualVal) / actualRTVal) * 100 : '-';

  const difference =
    viewMode === 'calc'
      ? getDifference(designVal, actualRTVal)
      : getDifference(designVal, actualVal);

  return (
    <div
      key={`${rowKey}${elemKey}`}
      className={classNames(styles.comparisonRow, {
        [styles.comparisonRowLightTheme]: theme.isLightTheme,
      })}
    >
      <div className={styles.comparisonNameCol}>
        {label} {unitDisplay ? `(${unitDisplay})` : ''}
      </div>
      <div className={styles.comparisonDesignCol}>
        {getFormattedValue(designVal)}
        <div className={styles.comparisonSortIcon} />
      </div>
      <div data-testid={`${PAGE_NAME}_strapsColumn`} className={styles.comparisonActualCol}>
        {getFormattedValue(actualVal)}
        <div className={styles.comparisonSortIcon} />
      </div>
      <div className={styles.comparisonActualCol}>
        {getFormattedValue(actualRTVal)}
        <div className={styles.comparisonSortIcon} />
      </div>
      <div className={styles.comparisonActualCol}>{getFormattedValue(varience)}</div>
      <div
        className={classNames(styles.comparisonActualCol, {
          [styles.comparisonGreaterThanTenPercent]: getIsGreaterThanTenPercent(difference),
        })}
      >
        {difference}
      </div>
      {showBar && (
        <div className={styles.comparisonChartCol}>
          {(Number.isFinite(actualVal) || Number.isFinite(designVal)) && (
            <ComparisonBar
              designVal={designVal}
              actualVal={actualVal}
              designColor="#eee"
              actualColor={actualColor}
              elemMax={elemMax}
            />
          )}
        </div>
      )}
    </div>
  );
};

ComparisonRow.propTypes = {
  rowKey: string.isRequired,
  label: string,
  elemKey: string,
  unitType: string,
  elemMax: number,
  summaries: shape,
  showBar: bool,
  viewMode: string,
};

ComparisonRow.defaultProps = {
  label: '',
  elemKey: '',
  unitType: '',
  elemMax: null,
  summaries: {},
  showBar: true,
  viewMode: null,
};

export default ComparisonRow;
