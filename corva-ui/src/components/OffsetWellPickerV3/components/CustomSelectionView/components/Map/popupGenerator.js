/* eslint-disable react/prop-types */
import moment from 'moment';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  popup: {
    color: '#fff',
    fontFamily: 'Roboto',
  },
  wellColor: {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
  },
  wellNameWrapper: {
    marginBottom: '8px',
  },
  wellName: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
    color: '#FFFFFF',
  },
  popupInfo: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
    color: '#BDBDBD',
  },
  popupFormation: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '17px',
    letterSpacing: '0.4px',
    color: '#BDBDBD',
  },
});

const popupGenerator = () => ({ well, color }) => {
  const styles = useStyles();

  return (
    <div className={styles.popup}>
      <div className={styles.wellNameWrapper}>
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

      <div className={styles.popupFormation}>
        <div className={styles.wellColor} style={{ backgroundColor: color }} />
        {well.formation}
      </div>
    </div>
  );
};

export default popupGenerator;
