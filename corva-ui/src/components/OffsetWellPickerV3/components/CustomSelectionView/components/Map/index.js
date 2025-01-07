import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import FormationsLegend from './FormationsLegend';
import popupGenerator from './popupGenerator';
import { getAllFormations } from './utils';
import Map from './Map';

const useStyles = makeStyles({
  mapContainerHidden: {
    marginTop: '20px',
    display: 'none',
  },
});

function MapContainer({
  open,
  subjectWell,
  wells,
  offsetWells,
  radius,
  mapHidden,
  isMobile,
  onAddOffsetWell,
  onDeleteOffsetWell,
}) {
  const classes = useStyles();

  const [formations, formationColors] = useMemo(() => getAllFormations(wells), [wells]);

  return (
    <div className={mapHidden && classes.mapContainerHidden}>
      <Map
        open={open}
        subjectWell={subjectWell}
        wells={wells}
        offsetWells={offsetWells}
        radius={radius}
        formationColors={formationColors}
        popUpFormatter={popupGenerator()}
        coordsDataPath="topHole.coordinates"
        onAddOffsetWell={onAddOffsetWell}
        onDeleteOffsetWell={onDeleteOffsetWell}
      />
      {!isMobile && <FormationsLegend formations={formations} formationColors={formationColors} />}
    </div>
  );
}

MapContainer.propTypes = {
  open: PropTypes.bool.isRequired,
  subjectWell: PropTypes.shape({}),
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  offsetWells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  radius: PropTypes.number,
  mapHidden: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onAddOffsetWell: PropTypes.func.isRequired,
  onDeleteOffsetWell: PropTypes.func.isRequired,
};

MapContainer.defaultProps = {
  subjectWell: null,
  radius: null,
};

export default memo(MapContainer);
