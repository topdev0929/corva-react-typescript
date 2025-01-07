import { createElement, memo, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import L from 'mapbox.js';
import { get } from 'lodash';
import { mapbox } from '~/utils';

import { usePrevious } from '../../effects';
import styles from './Map.css';

const { isValidCoordinates } = mapbox;

const RADIUS_CIRCLE_COLOR = '#03BCD4';
const METERS_IN_MILE = 1609.34;
const DEFAULT_SUBJECT_WELL_MARKER_SIZE = 8;
const DEFAULT_WELL_MARKER_SIZE = 5;
const OFFSET_WELL_COLOR = '#FFC107';

const DEFAULT_COORDS = [29.749907, -95.358421]; // TX coordinates

const toolTip =
  () =>
  // eslint-disable-next-line react/prop-types
  ({ well }) => {
    return (
      <div style={{ color: '#fff', background: '##414141' }}>
        <span style={{ fontSize: '11px', lineHeight: '16px' }}>{get(well, 'name')}</span>
      </div>
    );
  };

// eslint-disable-next-line no-unused-vars
function WellsMap({
  subjectWell,
  wells,
  offsetWells,
  radius,
  subjectWellMarkerSize,
  wellMarkerSize,
  coordsDataPath,
}) {
  const mapContainerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const markersGroupRef = useRef(null);
  const highlightMarkerRef = useRef(null);

  const prevWells = usePrevious(wells);

  const subjectWellCoords = useMemo(() => {
    return subjectWell && get(subjectWell, coordsDataPath);
  }, [subjectWell, coordsDataPath]);

  // NOTE: Initialize map
  useEffect(() => {
    mapContainerRef.current = L.mapbox
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
      .addTo(mapContainerRef.current);
    L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v9').addTo(mapContainerRef.current);
  }, []);

  // NOTE: Radius circle
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    // NOTE: Clean up
    if (radiusCircleRef.current) {
      mapContainerRef.current.removeLayer(radiusCircleRef.current);
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

    radiusCircleRef.current.addTo(mapContainerRef.current);
  }, [radius, subjectWellCoords]);

  const handleMouseOver = (markers, coords, r) => {
    highlightMarkerRef.current = L.circleMarker(coords, {
      radius: r * 3,
      stroke: false,
      fill: true,
      fillOpacity: 0.2,
      fillColor: OFFSET_WELL_COLOR,
      className: 'circle_highlight',
    });

    highlightMarkerRef.current.addEventListener('mouseout', () => {
      markersGroupRef.current.removeFrom(mapContainerRef.current);
      markersGroupRef.current = L.featureGroup(markers);
      markersGroupRef.current.addTo(mapContainerRef.current);

      mapContainerRef.current.closePopup();
    });

    const newMarkers = markers.concat(highlightMarkerRef.current);
    markersGroupRef.current = L.featureGroup(newMarkers);
    markersGroupRef.current.addTo(mapContainerRef.current);
  };

  // NOTE: Well markers
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    mapContainerRef.current.closePopup();

    // NOTE: Clean up
    if (markersGroupRef.current) {
      markersGroupRef.current.removeFrom(mapContainerRef.current);
    }

    const offsetWellIds = offsetWells.map(well => well.id);

    const markers = [];
    wells.forEach(well => {
      const coords = get(well, coordsDataPath);

      if (coords && isValidCoordinates(coords)) {
        const isWellSubject = subjectWell && subjectWell.id === well.id;
        const isWellOffset = offsetWellIds.includes(well.id);
        const r = isWellSubject ? subjectWellMarkerSize : wellMarkerSize;
        const color = OFFSET_WELL_COLOR;
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
          // Tooltip
          const tooltipContainer = document.createElement('div');
          const tootipContent = createElement(toolTip(), { well });
          ReactDOM.render(tootipContent, tooltipContainer);
          L.popup().setLatLng(coords).setContent(tooltipContainer).openOn(mapContainerRef.current);

          // Highlight
          handleMouseOver(markers, coords, r);
        });

        markers.push(newMarker);
      }
    });

    if (markers.length) {
      markersGroupRef.current = L.featureGroup(markers);
      markersGroupRef.current.addTo(mapContainerRef.current);
    }

    setTimeout(() => {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.bringToBack();
      }

      if (mapContainerRef.current && markersGroupRef.current && wells !== prevWells) {
        mapContainerRef.current.fitBounds(markersGroupRef.current.getBounds());
      }
    }, 500);
  }, [subjectWell, wells, offsetWells]);

  return (
    <div className={styles.map}>
      <div className={styles.mapMain} ref={mapContainerRef} />
    </div>
  );
}

WellsMap.propTypes = {
  subjectWell: PropTypes.shape({
    id: PropTypes.number,
    formation: PropTypes.string,
  }),
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  offsetWells: PropTypes.arrayOf(PropTypes.shape({})),
  radius: PropTypes.number.isRequired,
  subjectWellMarkerSize: PropTypes.number,
  wellMarkerSize: PropTypes.number,
  coordsDataPath: PropTypes.string,
};

WellsMap.defaultProps = {
  subjectWell: null,
  subjectWellMarkerSize: DEFAULT_SUBJECT_WELL_MARKER_SIZE,
  wellMarkerSize: DEFAULT_WELL_MARKER_SIZE,
  coordsDataPath: 'settings.top_hole.coordinates',
  offsetWells: null,
};

export default memo(WellsMap);
