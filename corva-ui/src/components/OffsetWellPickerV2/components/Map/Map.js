import { createElement, memo, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import L from 'mapbox.js';
import { get, sortBy } from 'lodash';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { mapbox } from '~/utils';
import { theme } from '~/config';

import { usePrevious } from '../../effects';
import styles from './Map.css';

const { isValidCoordinates } = mapbox;

const RADIUS_CIRCLE_COLOR = '#03BCD4';
const METERS_IN_MILE = 1609.34;
const DEFAULT_SUBJECT_WELL_MARKER_SIZE = 10;
const DEFAULT_WELL_MARKER_SIZE = 5;
const OFFSET_WELL_COLOR = '#00FFFF';
const COLORS = [
  '#FF00FF',
  '#F5BD80',
  '#FF0000',
  '#0080FF',
  '#FF8000',
  '#58ACFA',
  '#FA58F4',
  '#40FF00',
  '#4B8A08',
  '#40FF00',
  '#D8F781',
];

const DEFAULT_COORDS = [29.749907, -95.358421]; // TX coordinates

// eslint-disable-next-line no-unused-vars
function WellsMap({
  subjectWell,
  wells,
  offsetWells,
  radius,
  subjectWellMarkerSize,
  wellMarkerSize,
  popUpFormatter,
  coordsDataPath,
}) {
  const mapContainerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const markersGroupRef = useRef(null);

  const prevWells = usePrevious(wells);

  const restWells = useMemo(() => {
    return wells.filter(well => !subjectWell || subjectWell.id !== well.id);
  }, [subjectWell, wells]);

  const subjectWellCoords = useMemo(() => {
    return subjectWell && get(subjectWell, coordsDataPath);
  }, [subjectWell, coordsDataPath]);

  // NOTE: Get well marker colors according to its target formation
  const [formations, colorDict] = useMemo(() => {
    // NOTE: Determine well marker colors
    const restFormations = [];
    let hasNullFormation = false;

    restWells.forEach(well => {
      if (well.formation === 'Null') {
        hasNullFormation = true;
      } else if (
        (!subjectWell || subjectWell.formation !== well.formation) &&
        !restFormations.includes(well.formation)
      ) {
        restFormations.push(well.formation);
      }
    });

    const sortedFormations = subjectWell
      ? [subjectWell.formation].concat(sortBy(restFormations))
      : sortBy(restFormations);

    if (hasNullFormation && !sortedFormations.includes('Null')) {
      sortedFormations.push('Null');
    }

    const colors = sortedFormations.reduce(
      (result, item, idx) => ({
        ...result,
        [item]: COLORS[idx % COLORS.length],
      }),
      {}
    );

    return [sortedFormations, colors];
  }, [subjectWell, restWells]);

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
        const color = isWellSubject || isWellOffset ? OFFSET_WELL_COLOR : colorDict[well.formation];
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
              color: colorDict[well.formation],
            });
            // NOTE: Custom popup may have buttons
            ReactDOM.render(
              <MuiThemeProvider theme={theme.darkTheme}>{popUpContent}</MuiThemeProvider>,
              popUpContainer
            );

            L.popup().setLatLng(coords).setContent(popUpContainer).openOn(mapContainerRef.current);
          }
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

      if (mapContainerRef.current && radiusCircleRef.current && wells !== prevWells) {
        mapContainerRef.current.fitBounds(radiusCircleRef.current.getBounds(), { padding: [5, 5] });
      }
    }, 500);
  }, [subjectWell, wells, offsetWells, colorDict]);

  useEffect(() => {
    setTimeout(() => {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.bringToBack();
      }
      if (subjectWell) {
        if (mapContainerRef.current && radiusCircleRef.current) {
          mapContainerRef.current.fitBounds(radiusCircleRef.current.getBounds(), {
            padding: [5, 5],
          });
        }
      } else if (mapContainerRef.current && markersGroupRef.current) {
          mapContainerRef.current.fitBounds(markersGroupRef.current.getBounds());
        }
    }, 500);
  }, [radius, subjectWell]);

  return (
    <div className={styles.map}>
      <div className={styles.mapMain} ref={mapContainerRef} />

      <div className={styles.mapFooter}>
        {offsetWells && (
          <div className={styles.mapFooterItem}>
            <div
              className={styles.mapFooterItemSquare}
              style={{ backgroundColor: OFFSET_WELL_COLOR }}
            />
            <div className={styles.mapFooterItemLabel}>Selected Offset Wells</div>
          </div>
        )}

        {formations.map(item => (
          <div className={styles.mapFooterItem} key={item}>
            <div
              className={styles.mapFooterItemSquare}
              style={{ backgroundColor: colorDict[item] }}
            />
            <div className={styles.mapFooterItemLabel}>{item}</div>
          </div>
        ))}
      </div>
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
  popUpFormatter: PropTypes.func,
  coordsDataPath: PropTypes.string,
};

WellsMap.defaultProps = {
  subjectWell: null,
  subjectWellMarkerSize: DEFAULT_SUBJECT_WELL_MARKER_SIZE,
  wellMarkerSize: DEFAULT_WELL_MARKER_SIZE,
  popUpFormatter: null,
  coordsDataPath: 'settings.top_hole.coordinates',
  offsetWells: null,
};

export default memo(WellsMap);
