import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';

import { COMPONENT_FAMILIES } from '~/constants/casing';
import { convertValue, getUnitDisplay, getUnitPreference } from '~/utils';

import CasingTileIcon from '../CasingTileIcon';
import { useStyles } from './style';

const MetricsColumns = [
  { key: 'tv', label: 'Total Volume' },
  { key: 'tpt', label: 'Total Pumping Time' },
  { key: 'lt', label: 'Lead TOC' },
  { key: 'tt', label: 'Tail TOC' },
];

function getCasingSchematic(components) {
  const schematic = [];
  const componentNames = COMPONENT_FAMILIES.map(item => item.type);

  components.forEach(component => {
    const { family } = component;
    if (componentNames.includes(family)) {
      schematic.push({
        family,
      });
    }
  });

  return schematic.slice(-8);
}

function CasingTile({ tileData, onSelect, isMobile, isMetricsHidden }) {
  const classes = useStyles({ isMobile });
  const components = get(tileData, ['data', 'components']) || [];
  const schematicData = getCasingSchematic(components);
  const size = convertValue(get(tileData, ['data', 'outer_diameter']), 'shortLength', 'in');

  return (
    <div className={classes.tileContainer} onClick={() => onSelect(tileData)}>
      <div className={classes.header}>
        <div className={classes.casingTitle}>
          <span className={classes.bhaCaption}>
            {size}
            {getUnitPreference('shortLength') === 'in' ? '"' : getUnitDisplay('shortLength')} Casing
          </span>
        </div>
        <div className={classes.componentsCount}>Components: {components.length}</div>
      </div>
      {components.length > 0 && (
        <div className={classNames(classes.schematic, { [classes.schematicMobile]: isMobile })}>
          {schematicData.map((component, index) => (
            <CasingTileIcon
              // eslint-disable-next-line react/no-array-index-key
              key={`casing-tile-${index}`}
              component={component}
              width={`calc(100% / ${schematicData.length} - 1px)`}
            />
          ))}
        </div>
      )}
      {!isMetricsHidden && !isMobile && components.length > 0 && (
        <div className={classes.metricsContainer}>
          {MetricsColumns.map((metric, idx) => (
            <div key={metric.key} className={classes.metricItem}>
              <div className={classes.metricItemContent}>
                <div className={classes.metricItemLabel}>{metric.label}</div>
                <div className={classes.metricItemValue}>0.0</div>
              </div>
              {idx !== MetricsColumns.length - 1 && <div className={classes.metricItemSplit} />}
            </div>
          ))}
        </div>
      )}
      {components.length === 0 && (
        <div
          className={classNames(classes.noComponents, { [classes.noComponentsMobile]: isMobile })}
        >
          No Components
        </div>
      )}
    </div>
  );
}

CasingTile.propTypes = {
  tileData: PropTypes.shape({}),
  onSelect: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  isMetricsHidden: PropTypes.bool,
};

CasingTile.defaultProps = {
  tileData: {},
  isMobile: false,
  isMetricsHidden: true,
};

export default CasingTile;
