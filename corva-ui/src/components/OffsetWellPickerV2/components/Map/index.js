import { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import popupGenerator from './popupGenerator';
import Map from './Map';

import styles from './index.css';

function MapContainer({
  subjectWell,
  wells,
  offsetWells,
  radius,
  mapHidden,
  onSetSubjectWell,
  onRemoveSubjectWell,
  onAddOffsetWell,
  onDeleteOffsetWell,
}) {
  const offsetWellIds = useMemo(() => {
    return offsetWells.map(well => well.id);
  }, [offsetWells]);

  const handleAddOrDeleteOffsetWell = useCallback(
    (wellId, isOffset) => {
      if (!isOffset) {
        onAddOffsetWell(wellId);
      } else {
        onDeleteOffsetWell(wellId);
      }
    },
    [onAddOffsetWell, onDeleteOffsetWell]
  );

  const handleSetOrRemoveSubjectWell = useCallback(
    (wellId, isSubject) => {
      if (!isSubject) {
        onSetSubjectWell(wellId);
      } else {
        onRemoveSubjectWell(wellId);
      }
    },
    [onSetSubjectWell, onRemoveSubjectWell]
  );

  const containerClass = classNames(
    styles.mapContainer,
    mapHidden && styles.mapContainerHidden,
  );

  return (
    <div className={containerClass}>
      <Map
        subjectWell={subjectWell}
        wells={wells}
        offsetWells={offsetWells}
        radius={radius}
        popUpFormatter={popupGenerator(
          subjectWell,
          offsetWellIds,
          handleSetOrRemoveSubjectWell,
          handleAddOrDeleteOffsetWell
        )}
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
  mapHidden: PropTypes.bool.isRequired,
  onSetSubjectWell: PropTypes.func.isRequired,
  onRemoveSubjectWell: PropTypes.func.isRequired,
  onAddOffsetWell: PropTypes.func.isRequired,
  onDeleteOffsetWell: PropTypes.func.isRequired,
};

MapContainer.defaultProps = {
  subjectWell: null,
  radius: null,
};

export default memo(MapContainer);
