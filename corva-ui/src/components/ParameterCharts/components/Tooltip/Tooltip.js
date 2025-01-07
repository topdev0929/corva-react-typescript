import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { getUnitDisplay } from '~/utils/convert';

import styles from './Tooltip.css';

const BORDER_STYLES = {
  Dash: 'dashed',
  Solid: 'solid',
  Dot: 'dotted',
};

const round = val => (Number.isFinite(val) ? Math.round(val * 100000) / 100000 : '-');

const Tooltip = ({ points }) => {
  const firstValidPointIndex = useMemo(() => {
    for (let i = 0; i < points.length; i += 1) {
      if (points[i]?.[0]?.plotX) {
        return i;
      }
    }
    return 0;
  }, [points]);

  // TODO: find first track with points instead of taking just first
  return (
    <div
      className={styles.container}
      style={{
        transform: `translate(${points[firstValidPointIndex]?.[0]?.plotX}px, 0)`,
      }}
    >
      <div className={styles.indexTooltip}>{points[firstValidPointIndex]?.[0]?.x} ’</div>
      {points.map((point, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`points_from_track_${index}`} className={styles.tooltipContainer}>
            {!!point.length && (
              <table className={styles.content}>
                <tbody>
                  {point.map(({ id, y, series }) => (
                    <tr key={id}>
                      <td>
                        <div
                          className={styles.line}
                          style={{
                            borderBottom: `1px ${BORDER_STYLES[series?.userOptions?.dashStyle]} ${
                              series?.userOptions?.color || series?.userOptions?.lineColor
                            }`,
                          }}
                        />
                      </td>
                      <td className={styles.name}>{series?.userOptions?.name}</td>
                      <td className={styles.value}>{round(y)}</td>
                      <td className={styles.units}>
                        {getUnitDisplay(series?.userOptions?.unitType) || series?.userOptions?.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
};

Tooltip.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        plotX: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
      })
    )
  ).isRequired,
};

export default Tooltip;
