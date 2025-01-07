import PropTypes from 'prop-types';
import classNames from 'classnames';
import OffsetWellMap from '~/components/OffsetWellMap';
import styles from './WellsMap.module.css';
import { ViewType } from '../../constants';

export const WellsMap = ({
  isViewOnly,
  subjectWell,
  wells,
  offsetWellIds,
  radius,
  mapHidden,
  handleChanageOffsetWell,
  activeWellId,
  viewType,
}) => {
  return (
    <div
      className={
        mapHidden
          ? styles.mapContainerHidden
          : classNames(styles.mapContainer, {
              [styles.mapContainerMobile]: viewType === ViewType.mobile,
            })
      }
    >
      <OffsetWellMap
        isViewOnly={isViewOnly}
        subjectWell={subjectWell}
        wells={wells}
        offsetWellIds={offsetWellIds}
        radius={radius}
        handleChanageOffsetWell={handleChanageOffsetWell}
        activeWellId={activeWellId}
      />
    </div>
  );
};

WellsMap.propTypes = {
  isViewOnly: PropTypes.bool.isRequired,
  subjectWell: PropTypes.shape({}),
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  offsetWellIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  radius: PropTypes.number,
  mapHidden: PropTypes.bool.isRequired,
  handleChanageOffsetWell: PropTypes.func.isRequired,
  activeWellId: PropTypes.number.isRequired,
  viewType: PropTypes.string.isRequired,
};

WellsMap.defaultProps = {
  subjectWell: null,
  radius: null,
};
