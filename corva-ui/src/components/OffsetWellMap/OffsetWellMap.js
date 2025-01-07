import { createElement, useRef, useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from '@material-ui/core';
import { Add as ZoomInIcon, Remove as ZoomOutIcon } from '@material-ui/icons';
import L from 'mapbox.js';
import { mapbox } from '~/utils';
import styles from './OffsetWellMap.module.css';
import SubjectWellIcon from './CustomIcon/SubjectWellIcon.svg';
import SubjectHighlightWellIcon from './CustomIcon/SubjectHighlightWellIcon.svg';
import { usePreviousWells } from './effects';
import { WellTooltip } from './WellTooltip';
import { getAllFormations } from './utils';

const { isValidCoordinates } = mapbox;
const DEFAULT_COORDS = [29.749907, -95.358421];
const WELL_MARKER_SIZE = 5;
const HIGHLIGHT_MARKER_SIZE = 12;
const OFFSET_WELL_COLOR = '#03BCD4';
const RADIUS_CIRCLE_COLOR = '#03BCD4';
const HIGHLIGHT_WELL_COLOR = '#63EFFF';
const METERS_IN_MILE = 1609.34;
const ZOOM_INIT_VALUE = 3;
const ZOOM_MAX_VALUE = 18;
const ZOOM_MIN_VALUE = 1;
const MAX_RADIUS = 3000;

const bounds = ['_renderer', '_bounds', 'min'];

// eslint-disable-next-line no-unused-vars
const OffsetWellMap = ({
  isViewOnly,
  subjectWell,
  wells,
  offsetWellIds,
  radius,
  handleChanageOffsetWell,
  activeWellId,
  isClickable,
}) => {
  const subjectWellCoords = useMemo(() => {
    return subjectWell && get(subjectWell, 'topHole.coordinates');
  }, [subjectWell]);
  const formationColors = useMemo(() => getAllFormations(wells), [wells]);

  const mapRef = useRef();
  const radiusCircleRef = useRef();
  const subjectIconRef = useRef();
  const markersGroupRef = useRef();
  const highlightMarkerRef = useRef(null);
  const [isSubjectWellHovered, setIsSubjectWellHovered] = useState(false);
  const wellMarkers = useRef();
  const subjectWellMarker = useRef();
  const isActiveWellIsSubjectWell = subjectWell?.id === activeWellId;
  const prevWells = usePreviousWells(wells);
  const [initBounds, setInitBounds] = useState(null);
  const [zoom, setZoom] = useState(ZOOM_INIT_VALUE);

  // NOTE: Initialize map
  useEffect(() => {
    mapRef.current = L.mapbox
      .map(mapRef.current, null, {
        attributionControl: false,
        scrollWheelZoom: false,
        zoomControl: false,
      })
      .setView(DEFAULT_COORDS, ZOOM_INIT_VALUE)
      .on('zoomend', () => setZoom(mapRef.current.getZoom()));
    mapRef.current.doubleClickZoom.disable();

    L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v9').addTo(mapRef.current);
  }, []);

  // NOTE: Radius circle
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // NOTE: Clean up
    if (radiusCircleRef.current) {
      mapRef.current.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
    }
    if (subjectIconRef.current) {
      mapRef.current.removeLayer(subjectIconRef.current);
    }

    if (!subjectWellCoords) {
      radiusCircleRef.current = null;
      subjectIconRef.current = null;
      return;
    }

    if (radius) {
      radiusCircleRef.current = L.circle(subjectWellCoords, radius * METERS_IN_MILE, {
        stroke: false,
        fill: true,
        fillOpacity: 0.2,
        fillColor: RADIUS_CIRCLE_COLOR,
        className: 'circle_500',
      });

      radiusCircleRef.current.addTo(mapRef.current);
    }
  }, [radius, subjectWellCoords]);

  // NOTE: Highlight marker
  const handleHighlightMarker = (
    currentMarker,
    coords,
    color,
    well,
    isOffsetWell,
    isSubjectWell
  ) => {
    if (isSubjectWell) {
      currentMarker.setStyle({ fillColor: HIGHLIGHT_WELL_COLOR });
      setIsSubjectWellHovered(true);
    }

    highlightMarkerRef.current = L.circleMarker(coords, {
      radius: isSubjectWell ? WELL_MARKER_SIZE : HIGHLIGHT_MARKER_SIZE,
      stroke: false,
      fill: true,
      fillOpacity: 0.24,
      fillColor: isSubjectWell ? HIGHLIGHT_WELL_COLOR : color,
      className: 'circle_highlight',
    });

    highlightMarkerRef.current.addEventListener('mouseout', () => {
      markersGroupRef.current.removeFrom(mapRef.current);
      markersGroupRef.current = L.featureGroup(wellMarkers.current);
      markersGroupRef.current.addTo(mapRef.current);
      mapRef.current.closePopup();
      if (isSubjectWell) {
        currentMarker.setStyle({ fillColor: OFFSET_WELL_COLOR });
        setIsSubjectWellHovered(false);
      }
    });

    highlightMarkerRef.current.addEventListener('click', () => {
      if (isViewOnly) return;
      if (isOffsetWell) {
        handleChanageOffsetWell(well, false);
      } else {
        handleChanageOffsetWell(well, true);
      }
    });

    const newMarkers = wellMarkers.current.concat(highlightMarkerRef.current);
    markersGroupRef.current.removeFrom(mapRef.current);
    markersGroupRef.current = L.featureGroup(newMarkers);
    markersGroupRef.current.addTo(mapRef.current);
  };

  const showTooltip = (well, isOffsetWell, isSubjectWell, coords, offset) => {
    const popUpContainer = document.createElement('div');
    const popUpContent = createElement(WellTooltip(), {
      isViewOnly,
      well,
      color: get(formationColors, well.formation, '#BDBDBD'),
      isOffsetWell,
      isSubjectWell,
      offset,
      isClickable,
    });
    ReactDOM.render(<>{popUpContent}</>, popUpContainer);
    L.popup().setLatLng(coords).setContent(popUpContainer).openOn(mapRef.current);
  };

  // NOTE: Well markers
  useEffect(() => {
    if (!mapRef.current || !wells || !offsetWellIds) {
      return;
    }

    mapRef.current.closePopup();

    // NOTE: Clean up
    if (markersGroupRef.current) {
      markersGroupRef.current.removeFrom(mapRef.current);
    }

    const markers = [];
    const offsetWells = [];
    const unSelectedWells = [];
    wells.forEach(well => {
      if (well.id !== subjectWell?.id) {
        if (offsetWellIds.includes(well.id)) {
          offsetWells.push(well);
        } else {
          unSelectedWells.push(well);
        }
      }
    });
    const sortedWells = [...unSelectedWells, ...offsetWells, subjectWell];
    sortedWells.forEach(well => {
      const coords = well?.topHole?.coordinates;

      if (coords && isValidCoordinates(coords)) {
        const isSubjectWell = subjectWell?.id === well.id;
        const isOffsetWell = offsetWellIds.includes(well.id) && !isSubjectWell;
        const color = isSubjectWell
          ? OFFSET_WELL_COLOR
          : get(formationColors, well.formation, '#BDBDBD');
        const opacity = isOffsetWell ? 0.7 : 0.3;

        if (isOffsetWell) {
          const newHighlightMarker = L.circleMarker(coords, {
            radius: HIGHLIGHT_MARKER_SIZE,
            stroke: false,
            fill: true,
            fillColor: color,
            calssname: 'circle_500',
            fillOpacity: 0.08,
          });
          markers.push(newHighlightMarker);
        }

        const newMarker = L.circleMarker(coords, {
          radius: WELL_MARKER_SIZE,
          stroke: false,
          fill: true,
          fillOpacity: isSubjectWell ? 1 : opacity,
          fillColor: color,
          className: 'circle_500',
        });

        newMarker.addEventListener('mouseover', e => {
          let offset = [0, 0];
          if (initBounds && get(e.target, bounds)) {
            offset = [
              get(e.target, bounds).x - initBounds.x,
              get(e.target, bounds).y - initBounds.y,
            ];
          }
          showTooltip(well, isOffsetWell, isSubjectWell, coords, offset);

          // Highlight
          handleHighlightMarker(newMarker, coords, color, well, isOffsetWell, isSubjectWell);
        });

        if (isSubjectWell) {
          subjectWellMarker.current = newMarker;
        }

        markers.push(newMarker);

        if (well.id === activeWellId && !isActiveWellIsSubjectWell) {
          const highlightMarker = L.circleMarker(coords, {
            radius: HIGHLIGHT_MARKER_SIZE,
            stroke: false,
            fill: true,
            fillOpacity: 0.24,
            fillColor: color,
            className: 'circle_1200',
          });
          markers.push(highlightMarker);
        }
      }
    });

    if (markers.length) {
      markersGroupRef.current = L.featureGroup(markers);
      markersGroupRef.current.addTo(mapRef.current);
    }
    wellMarkers.current = markers;

    setTimeout(() => {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.bringToBack();
      }

      if (radius < MAX_RADIUS && mapRef.current && radiusCircleRef.current && wells !== prevWells) {
        mapRef.current.fitBounds(radiusCircleRef.current.getBounds(), { padding: [5, 5] });
      }
    }, 500);
  }, [subjectWell, wells, offsetWellIds, initBounds]);

  // NOTE: Subject Well Icon

  useEffect(() => {
    if (!isSubjectWellHovered) return;
    if (get(mapRef.current, bounds)) {
      const offset = [
        get(mapRef.current, bounds).x - initBounds.x,
        get(mapRef.current, bounds).y - initBounds.y,
      ];
      showTooltip(subjectWell, false, true, subjectWellCoords, offset);
    }
  }, [isSubjectWellHovered, initBounds, subjectWell, subjectWellCoords]);

  useEffect(() => {
    if (!mapRef.current || !subjectWellCoords) return;

    if (subjectIconRef.current) {
      subjectIconRef.current.removeFrom(mapRef.current);
    }

    const icon = L.icon({
      iconUrl:
        isSubjectWellHovered || isActiveWellIsSubjectWell
          ? SubjectHighlightWellIcon
          : SubjectWellIcon,
      iconSize: isSubjectWellHovered || isActiveWellIsSubjectWell ? [70, 20] : [62, 12],
      iconAnchor: isSubjectWellHovered || isActiveWellIsSubjectWell ? [35, 29] : [31, 25],
      className: 'dot',
    });
    subjectIconRef.current = L.marker(subjectWellCoords, { icon });
    subjectIconRef.current.addTo(mapRef.current);

    if (subjectWellMarker.current) {
      subjectIconRef.current.addEventListener('mouseover', () => {
        setIsSubjectWellHovered(true);

        handleHighlightMarker(
          subjectWellMarker.current,
          subjectWellCoords,
          OFFSET_WELL_COLOR,
          subjectWell,
          true,
          true
        );
      });

      subjectIconRef.current.addEventListener('mouseout', () => {
        markersGroupRef.current.removeFrom(mapRef.current);
        markersGroupRef.current = L.featureGroup(wellMarkers.current);
        markersGroupRef.current.addTo(mapRef.current);
        mapRef.current.closePopup();
        subjectWellMarker.current.setStyle({ fillColor: OFFSET_WELL_COLOR });
        setIsSubjectWellHovered(false);
      });
    }
  }, [
    isSubjectWellHovered,
    subjectWellCoords,
    radius,
    subjectWell,
    isActiveWellIsSubjectWell,
    initBounds,
  ]);

  // NOTE: Map Update
  useEffect(() => {
    if (radius > MAX_RADIUS) {
      mapRef.current.setZoom(1);
      return;
    }
    setTimeout(() => {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.bringToBack();
      }
      if (subjectWell) {
        if (mapRef.current && radiusCircleRef.current && radius) {
          mapRef.current.fitBounds(radiusCircleRef.current.getBounds(), {
            padding: [5, 5],
          });
        }
      } else if (mapRef.current && markersGroupRef.current) {
        mapRef.current.fitBounds(markersGroupRef.current.getBounds());
      }
      if (subjectWellCoords) {
        mapRef.current.panTo(subjectWellCoords, {
          duration: 0.7,
          easeLinearity: 0.25,
        });
      }
      if (get(mapRef.current, bounds)) {
        setInitBounds(get(mapRef.current, bounds));
      }
    }, 500);
  }, [radius, subjectWell, subjectWellCoords]);

  const handleZoomIn = () => {
    mapRef.current.setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      mapRef.current.setZoom(zoom - 1);
    }
  };

  return (
    <div className={styles.mapView}>
      <div className={styles.mapMain} ref={mapRef} onDoubleClick={handleZoomIn}>
        <div className={styles.zoomGroup}>
          <Tooltip title={zoom < ZOOM_MAX_VALUE ? 'Zoom in' : ''} placement="left">
            <div
              className={classNames(styles.zoomButton, {
                [styles.zoomDisabled]: zoom === ZOOM_MAX_VALUE,
              })}
              onClick={handleZoomIn}
            >
              <ZoomInIcon className={styles.zoomInOutIcon} />
            </div>
          </Tooltip>
          <Tooltip title={zoom > ZOOM_MIN_VALUE ? 'Zoom out' : ''} placement="left">
            <div
              className={classNames(styles.zoomButton, {
                [styles.zoomDisabled]: zoom === ZOOM_MIN_VALUE,
              })}
              onClick={handleZoomOut}
            >
              <ZoomOutIcon className={styles.zoomInOutIcon} />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

OffsetWellMap.propTypes = {
  isViewOnly: PropTypes.bool.isRequired,
  subjectWell: PropTypes.shape({
    id: PropTypes.number,
    formation: PropTypes.string,
  }),
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  offsetWellIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  radius: PropTypes.number.isRequired,
  handleChanageOffsetWell: PropTypes.func.isRequired,
  activeWellId: PropTypes.number.isRequired,
  isClickable: PropTypes.bool,
};

OffsetWellMap.defaultProps = {
  subjectWell: null,
  isClickable: true,
};

export default OffsetWellMap;
