import { shape, string } from 'prop-types';
import { Typography, Grid, makeStyles } from '@material-ui/core';

import { getBhaBitSize, getBhaDepthIn } from '~/utils/bha';

const useStyles = makeStyles(theme => ({
  labelGrid: {
    marginRight: 11,
  },
  planUnit: {
    color: theme.palette.grey[400],
    marginLeft: 5,
    fontSize: 12,
  },
  planText: {
    color: theme.palette.grey[400],
  },
  pointValue: {
    display: 'flex',
    alignItems: 'center',
  },
  columnWithMargin: {
    marginRight: 40,
  },
}));

const Info = ({ feedItem, bitComponent, pageName }) => {
  const classes = useStyles();

  const bhaData = feedItem.context?.bha?.data;
  const components = bhaData?.components;
  const startDepth = bhaData?.start_depth;

  const bitSize = getBhaBitSize(components);
  const depthIn = getBhaDepthIn(startDepth);

  const bitMaker = bitComponent?.make || '-';
  const bitModel = bitComponent?.model || '-';

  return (
    <Grid container spacing={16} justify="flex-start">
      <Grid item className={classes.labelGrid}>
        <Typography variant="body2" className={classes.planText}>
          Bit Size:
        </Typography>
        <Typography variant="body2" className={classes.planText}>
          Depth In:
        </Typography>
      </Grid>
      <Grid item className={classes.columnWithMargin}>
        <Typography variant="body2" className={classes.pointValue}>
          {bitSize}
        </Typography>
        <Typography
          variant="body2"
          data-testid={`${pageName}_bitSize`}
          className={classes.pointValue}
        >
          {depthIn}
        </Typography>
      </Grid>
      <Grid item className={classes.labelGrid}>
        <Typography variant="body2" className={classes.planText}>
          Bit Maker:
        </Typography>
        <Typography variant="body2" className={classes.planText}>
          Bit Model:
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          variant="body2"
          data-testid={`${pageName}_bitMaker`}
          className={classes.pointValue}
        >
          {bitMaker}
        </Typography>
        <Typography
          variant="body2"
          data-testid={`${pageName}_bitModel`}
          className={classes.pointValue}
        >
          {bitModel}
        </Typography>
      </Grid>
    </Grid>
  );
};

Info.propTypes = {
  feedItem: shape().isRequired,
  bitComponent: shape().isRequired,
  pageName: string.isRequired,
};

export default Info;
