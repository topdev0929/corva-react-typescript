import { number } from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';

const PAGE_NAME = 'FeedActivityPo';

const useStyles = makeStyles({
  wrapper: {
    marginRight: 40,
  },
  vsa: {
    color: blue[300],
  },
});

const VerticalSectionAzimuth = ({ vsa }) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Typography variant="body2" gutterBottom>
        Vertical section Azimuth:
      </Typography>
      <Typography
        data-testid={`${PAGE_NAME}_wellPlan_verticalAzimuth`}
        variant="h5"
        className={classes.vsa}
      >
        {vsa}
      </Typography>
    </div>
  );
};

VerticalSectionAzimuth.propTypes = {
  vsa: number.isRequired,
};

export default VerticalSectionAzimuth;
