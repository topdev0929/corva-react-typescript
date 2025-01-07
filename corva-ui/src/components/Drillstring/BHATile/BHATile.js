import { shape, bool, func, arrayOf, number } from 'prop-types';
import classNames from 'classnames';
import { Chip } from '@material-ui/core';
import { getBHASchematic } from '~/utils/bha';
import BHATileIcon from '../BHATileIcon';
import styles from './styles.css';

const MetricsColumns = [
  { key: 'tfa', label: 'TFA' },
  { key: 'cpl', label: 'CPL at TD' },
  { key: 'sp', label: 'SP at TD' },
  { key: 'ecd', label: 'ECD at TD' },
];

function BHATile({ isMobile, drillstring, isSelected, onSelect, height, isMetricsHidden }) {
  const components = drillstring?.data?.components || [];
  const schematicData = getBHASchematic(components);

  return (
    <div
      className={classNames(styles.tileContainer, { [styles.selected]: isSelected })}
      onClick={() => onSelect(drillstring)}
    >
      <div className={styles.header}>
        <div className={styles.bhaTile}>
          <Chip
            label={drillstring?.data?.id}
            classes={{
              root: classNames(styles.rootChip, { [styles.selectedChip]: isSelected }),
              label: styles.chipLabel,
            }}
          />
          <span className={styles.bhaCaption}>BHA</span>
        </div>
        <div className={styles.componentsCount}>Components: {components.length}</div>
      </div>

      {components.length > 0 && (
        <div className={classNames(styles.schematic, { [styles.schematicMobile]: isMobile })}>
          {schematicData.map((component, index) => (
            <BHATileIcon
              // eslint-disable-next-line react/no-array-index-key
              key={`bha-tile-${index}`}
              component={component}
              width={`calc(100% / ${schematicData.length} - 1px)`}
              height={height}
            />
          ))}
        </div>
      )}

      {!isMetricsHidden && !isMobile && components.length > 0 && (
        <div className={styles.metricsContainer}>
          {MetricsColumns.map(metric => (
            <div key={metric.key} className={styles.metricItem}>
              <div className={styles.metricItemContent}>
                <div className={styles.metricItemLabel}>{metric.label}</div>
                <div className={styles.metricItemValue}>0.0</div>
              </div>
              {metric.key !== 'ecd' && <div className={styles.metricItemSplit} />}
            </div>
          ))}
        </div>
      )}

      {components.length === 0 && (
        <div className={classNames(styles.noComponents, { [styles.noComponentsMobile]: isMobile })}>
          No Components
        </div>
      )}
    </div>
  );
}

BHATile.propTypes = {
  drillstring: shape({
    data: shape({ components: arrayOf(shape({})) }),
  }),
  isSelected: bool,
  onSelect: func.isRequired,
  height: number,
  isMetricsHidden: bool,
  isMobile: bool,
};

BHATile.defaultProps = {
  drillstring: null,
  isSelected: false,
  height: 16,
  isMetricsHidden: false,
  isMobile: false,
};

export default BHATile;
