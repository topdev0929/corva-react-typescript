import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Map from './Map';
import styles from './index.css';

function MapContainer({ subjectWell, wells, offsetWells, radius, mapHidden }) {
  const containerClass = classNames(styles.mapContainer, mapHidden && styles.mapContainerHidden);

  return (
    <div className={containerClass}>
      <Map
        subjectWell={subjectWell}
        wells={wells}
        offsetWells={offsetWells}
        radius={radius}
        coordsDataPath="topHole.coordinates"
      />
    </div>
  );
}

MapContainer.propTypes = {
  subjectWell: PropTypes.shape({}),
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  offsetWells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  radius: PropTypes.number,
  mapHidden: PropTypes.bool,
};

MapContainer.defaultProps = {
  subjectWell: null,
  radius: 5,
  mapHidden: false,
};

export default memo(MapContainer);
