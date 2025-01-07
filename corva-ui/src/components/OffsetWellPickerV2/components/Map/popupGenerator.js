/* eslint-disable react/prop-types */
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';

import styles from './popup.css';

const PAGE_NAME = 'popupGenerator';

const popupGenerator = (
  subjectWell,
  offsetWellIds,
  handleSetOrRemoveSubjectWell,
  handleAddOrDeleteOffsetWell
) => ({ well, color }) => {
  const isOffset = offsetWellIds.includes(well.id);

  const isSubject = subjectWell && subjectWell.id === well.id;

  return (
    <div className={styles.popup}>
      <div>
        <div className={styles.wellColor} style={{ backgroundColor: color }} />
        <span className={styles.wellName}>{well.name}</span>
      </div>

      <div className={styles.popupInfo}>
        Well Depth:
        {Number.isFinite(well.rigReleaseDate) ? `${Math.floor(well.totalDepth)} ft` : 'N/A'}
      </div>

      <div className={styles.popupInfo}>
        Release Date:
        {Number.isFinite(well.rigReleaseDate)
          ? moment.unix(well.rigReleaseDate).format('MM/DD/YYYY')
          : 'N/A'}
      </div>

      <div className={styles.popupActions}>
        {isSubject ? (
          <div
            data-testid={`${PAGE_NAME}_removeSubjectWell`}
            className={styles.popupButton}
            onClick={() => handleSetOrRemoveSubjectWell(well.id, isSubject)}
          >
            <div className={styles.popupButtonIcon}>
              <DeleteIcon />
            </div>
            <div className={styles.popupButtonLabel}>Remove Subject Well</div>
          </div>
        ) : (
          <div
            data-testid={`${PAGE_NAME}_setSubjectWell`}
            className={styles.popupButton}
            onClick={() => handleSetOrRemoveSubjectWell(well.id, isSubject)}
          >
            <div className={styles.popupButtonIcon}>
              <CenterFocusStrongIcon />
            </div>
            <div className={styles.popupButtonLabel}>Set Subject Well</div>
          </div>
        )}
        {!isSubject && (
          <div
            className={`${styles.popupButton} ${styles.popupButtonContained}`}
            onClick={() => handleAddOrDeleteOffsetWell(well.id, isOffset)}
          >
            {isOffset ? (
              <div
                data-testid={`${PAGE_NAME}_removeOffsetWell`}
                className={styles.popupButtonLabel}
              >
                Remove Offset
              </div>
            ) : (
              <div
                data-testid={`${PAGE_NAME}_selectOffsetWell`}
                className={styles.popupButtonLabel}
              >
                Select As Offset
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default popupGenerator;
