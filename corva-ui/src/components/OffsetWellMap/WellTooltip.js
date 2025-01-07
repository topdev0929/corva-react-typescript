import classNames from 'classnames';
import moment from 'moment';
import InfoIcon from '@material-ui/icons/Info';
import BlockIcon from '@material-ui/icons/Block';
import styles from './WellTooltip.module.css';

export const WellTooltip =
  () =>
  ({ isViewOnly, well, color, isOffsetWell, isSubjectWell, offset, isClickable }) => {
    return (
      <div
        className={styles.wellTooltip}
        style={{ marginLeft: offset?.[0], marginTop: offset?.[1] }}
      >
        <span className={classNames(styles.commonItem, styles.wellName)}>{well.name}</span>

        <div className={styles.tooltipItem}>
          Depth:&nbsp;
          {Number.isFinite(well.totalDepth) ? Math.floor(well.totalDepth).toFixed(2) : 'N/A'}
          {Number.isFinite(well.totalDepth) && <span className={styles.unit}>&nbsp;ft</span>}
        </div>

        <div className={classNames(styles.commonItem, styles.tooltipItem)}>
          Release Date:&nbsp;
          {Number.isFinite(well.rigReleaseDate)
            ? moment.unix(well.rigReleaseDate).format('MM/DD/YYYY')
            : 'N/A'}
        </div>

        <div className={classNames(styles.commonItem, styles.formationItem)}>
          Target Formation:
          <div className={styles.formation} style={{ backgroundColor: color }} />
          {well.formation}
        </div>

        {!isViewOnly && !isSubjectWell && isClickable && (
          <div className={classNames(styles.commonItem, styles.info)}>
            {isOffsetWell ? (
              <BlockIcon className={styles.blockIcon} />
            ) : (
              <InfoIcon className={styles.infoIcon} />
            )}
            {isOffsetWell ? (
              <span className={styles.infoLabel}>Click to deselect Offset Well</span>
            ) : (
              <span className={styles.infoLabel}>Click to select Offset Well</span>
            )}
          </div>
        )}
      </div>
    );
  };
