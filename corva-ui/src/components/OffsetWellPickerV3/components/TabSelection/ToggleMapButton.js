import { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import {
  Map as MapIcon,
  UnfoldMore as UnfoldMoreIcon,
  UnfoldLess as UnfoldLessIcon,
} from '@material-ui/icons/';
import { IconButton as IconButtonComponent } from '~/components';

const useStyles = makeStyles({
  iconButtonWrapper: {
    marginTop: 5,
    width: '40px',
  },
  mapExpandIconGroup: {
    display: 'flex',
    flexDirection: 'column',
    height: '26px',
    width: '26px',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ToggleMapButton = ({ mapHidden, onToggleMap, isMobile }) => {
  const classes = useStyles();

  const handleToggleMap = () => {
    onToggleMap();
  };

  return (
    <div className={classes.iconButtonWrapper}>
      <IconButtonComponent
        size="small"
        variant="contained"
        tooltipProps={
          isMobile ? { title: '' } : { title: mapHidden ? 'Expand Map' : 'Collapse Map' }
        }
        onClick={handleToggleMap}
      >
        <div className={classes.mapExpandIconGroup}>
          <MapIcon fontSize="inherit" />
          {mapHidden ? (
            <UnfoldMoreIcon fontSize="inherit" />
            ) : (
              <UnfoldLessIcon fontSize="inherit" />
            )}
        </div>
      </IconButtonComponent>
    </div>
  );
};

ToggleMapButton.propTypes = {
  mapHidden: PropTypes.bool.isRequired,
  onToggleMap: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default memo(ToggleMapButton);
