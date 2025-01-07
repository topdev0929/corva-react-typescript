import { createElement, memo, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import L from 'mapbox.js';
import { get, sortBy } from 'lodash';
import { mapbox } from '~/utils';

import { usePrevious } from '../../effects';
import styles from './Map.css';

const { isValidCoordinates } = mapbox;

const DEFAULT_COORDS = [29.749907, -95.358421]; // TX coordinates
const RADIUS_CIRCLE_COLOR = '#03BCD4';
const METERS_IN_MILE = 1609.34;
const DEFAULT_SUBJECT_WELL_MARKER_SIZE = 10;
const DEFAULT_WELL_MARKER_SIZE = 5;
const OFFSET_WELL_COLOR = '#00FFFF';

// eslint-disable-next-line no-unused-vars
function WellsMap({
  open,
  subjectWell,
  wells,
  offsetWells,
  radius,
  formationColors,
  popUpFormatter,
  coordsDataPath,
  onAddOffsetWell,
  onDeleteOffsetWell,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef();
  const radiusCircleRef = useRef(null);
  const markersGroupRef = useRef(null);

  const prevWells = usePrevious(wells);

  const subjectWellCoords = useMemo(() => {
    return subjectWell && get(subjectWell, coordsDataPath);
  }, [subjectWell, coordsDataPath]);

  // NOTE: Initialize map
  useEffect(() => {
    if (!open || mapRef.current) return;

    mapRef.current = L.mapbox
      .map(mapContainerRef.current, null, {
        attributionControl: false,
        scrollWheelZoom: false,
        zoomControl: false,
      })
      .setView(DEFAULT_COORDS, 1);

    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(mapRef.current);
    L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v9').addTo(mapRef.current);
  }, [open]);

  // NOTE: Radius circle
  useEffect(() => {
    if (!mapRef.current || !open) {
      return;
    }

    // NOTE: Clean up
    if (radiusCircleRef.current) {
      mapRef.current.removeLayer(radiusCircleRef.current);
    }

    if (!subjectWellCoords) {
      radiusCircleRef.current = null;
      return;
    }

    radiusCircleRef.current = L.circle(subjectWellCoords, radius * METERS_IN_MILE, {
      stroke: false,
      fill: true,
      fillOpacity: 0.2,
      fillColor: RADIUS_CIRCLE_COLOR,
      className: 'circle_500',
    });

    radiusCircleRef.current.addTo(mapRef.current);
  }, [radius, subjectWellCoords, open]);

  // NOTE: Well markers
  useEffect(() => {
    if (!mapRef.current || !open) {
      return;
    }

    // NOTE: Clean up
    if (markersGroupRef.current) {
      markersGroupRef.current.removeFrom(mapRef.current);
    }

    const offsetWellIds = offsetWells.map(well => well.id);
    const sortedWells = sortBy(wells, well => offsetWellIds.includes(well.id));

    const markers = [];
    sortedWells.forEach(well => {
      const coords = get(well, coordsDataPath);

      if (coords && isValidCoordinates(coords)) {
        const isWellSubject = subjectWell && subjectWell.id === well.id;
        const isWellOffset = offsetWellIds.includes(well.id);
        const r = isWellSubject ? DEFAULT_SUBJECT_WELL_MARKER_SIZE : DEFAULT_WELL_MARKER_SIZE;
        const color =
          isWellSubject || isWellOffset
            ? OFFSET_WELL_COLOR
            : get(formationColors, well.formation, '#BDBDBD');
        const opacity = isWellSubject || isWellOffset ? 1 : 0.3;

        const newMarker = L.circleMarker(coords, {
          radius: r,
          stroke: false,
          fill: true,
          fillOpacity: opacity,
          fillColor: color,
          className: 'circle_500',
        });

        newMarker.addEventListener('mouseover', () => {
          if (popUpFormatter) {
            // Container to put React generated content in.
            const popUpContainer = document.createElement('div');
            const popUpContent = createElement(popUpFormatter, {
              well,
              color: get(formationColors, well.formation, '#BDBDBD'),
            });
            // NOTE: Custom popup may have buttons
            ReactDOM.render(<>{popUpContent}</>, popUpContainer);

            L.popup().setLatLng(coords).setContent(popUpContainer).openOn(mapRef.current);
          }
        });

        newMarker.addEventListener('mouseout', () => {
          mapRef.current.closePopup();
        });

        newMarker.addEventListener('click', () => {
          if (isWellOffset && !isWellSubject) {
            onDeleteOffsetWell(well.id);
          } else {
            onAddOffsetWell(well.id);
          }
        });

        markers.push(newMarker);
      }
    });

    if (markers.length) {
      markersGroupRef.current = L.featureGroup(markers);
      markersGroupRef.current.addTo(mapRef.current);
    }

    setTimeout(() => {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.bringToBack();
      }

      if (mapRef.current && radiusCircleRef.current && wells !== prevWells) {
        mapRef.current.fitBounds(radiusCircleRef.current.getBounds(), { padding: [5, 5] });
      }
    }, 500);
  }, [subjectWell, wells, offsetWells, open]);

  useEffect(() => {
    if (!open) return;

    setTimeout(() => {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.bringToBack();
      }
      if (subjectWell) {
        if (mapRef.current && radiusCircleRef.current) {
          mapRef.current.fitBounds(radiusCircleRef.current.getBounds(), {
            padding: [5, 5],
          });
        }
      } else if (mapRef.current && markersGroupRef.current) {
        mapRef.current.fitBounds(markersGroupRef.current.getBounds());
      }
    }, 500);
  }, [radius, subjectWell, open]);

  return (
    <div className={styles.map}>
      <div className={styles.mapMain} ref={mapContainerRef} />
    </div>
  );
}

WellsMap.propTypes = {
  open: PropTypes.bool.isRequired,
  subjectWell: PropTypes.shape({
    id: PropTypes.number,
    formation: PropTypes.string,
  }),
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  offsetWells: PropTypes.arrayOf(PropTypes.shape({})),
  radius: PropTypes.number.isRequired,
  formationColors: PropTypes.shape({}).isRequired,
  popUpFormatter: PropTypes.func,
  coordsDataPath: PropTypes.string,
  onAddOffsetWell: PropTypes.func.isRequired,
  onDeleteOffsetWell: PropTypes.func.isRequired,
};

WellsMap.defaultProps = {
  subjectWell: null,
  popUpFormatter: null,
  coordsDataPath: 'settings.top_hole.coordinates',
  offsetWells: null,
};

export default memo(WellsMap);
