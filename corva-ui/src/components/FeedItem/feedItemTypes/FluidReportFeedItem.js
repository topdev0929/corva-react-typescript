import { useMemo } from 'react';
import { shape, number, string, arrayOf } from 'prop-types';
import classNames from 'classnames';

import { Typography, Grid, makeStyles } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';

import { convertValue, getUnitDisplay } from '~/utils/convert';
import { ctop } from '~/utils/FluidCheckUtils';

const PAGE_NAME = 'fluidReportActivity';

const useStyles = makeStyles(theme => ({
  density: {
    color: blue[300],
  },
  unit: {
    color: theme.palette.grey[400],
    marginLeft: 5,
  },
  oneLineText: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: theme.palette.grey[400],
  },
  columnWithMargin: {
    marginRight: 40,
  },
}));

const FluidReportFeedItem = ({
  feedItem: {
    context: {
      fluid_report: {
        data: {
          depth: depthNotConverted,
          mud_type: mudType,
          mud_density: mudDensity,
          viscosity: { pv = '', yp = '', rpm_readings: rpmReadings },
        },
      },
    },
  },
}) => {
  const classes = useStyles();

  const depth = ctop(depthNotConverted, 'length', 'ft');
  const depthString = depth ? depth.formatNumeral('0,0') : '-';
  const depthUnit = getUnitDisplay('length');

  const convertedMudDensity = convertValue(+mudDensity, 'density', 'ppg');
  const mudDensityFormatted = convertedMudDensity.formatNumeral('0,0.00');
  const densityUnit = getUnitDisplay('density');

  const pvUnit = 'cP';
  const ypUnit = getUnitDisplay('yp');
  const pvFormatted = Number.isFinite(pv) ? pv.fixFloat(3) : pv;
  const ypFormatted = Number.isFinite(yp) ? yp.fixFloat(3) : yp;

  const rheometerReadingsString = useMemo(() => {
    const rpmReadingsLastItemIndex = rpmReadings.length - 1;

    return rpmReadings.reduce((resultString, reading, index) => {
      const commaString = index === rpmReadingsLastItemIndex ? '' : ', ';
      const readingString = `${reading.rpm}/${reading.dial_reading}`;
      return `${resultString}${readingString}${commaString}`;
    }, '');
  }, [rpmReadings]);

  return (
    <Grid container spacing="40" justify="flex-start">
      <Grid item className={classes.columnWithMargin}>
        <Typography variant="body2">Density</Typography>
        <Typography
          variant="h6"
          data-testid={`${PAGE_NAME}_density`}
          className={classNames(classes.density, classes.oneLineText)}
        >
          {mudDensityFormatted}
          <Typography component="span" variant="caption" className={classes.unit}>
            ({densityUnit})
          </Typography>
        </Typography>
        <Typography className={classes.oneLineText}>
          {depthString}
          <Typography component="span" variant="caption" className={classes.unit}>
            ({depthUnit})
          </Typography>
          &nbsp;/ {mudType}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          variant="body2"
          data-testid={`${PAGE_NAME}_viscosity`}
          className={classes.oneLineText}
        >
          <Typography variant="span" className={classes.title}>
            PV:&nbsp;
          </Typography>
          {`${pvFormatted} ${pvUnit} / YP: ${ypFormatted}`}
          <Typography component="span" variant="caption" className={classes.unit}>
            {ypUnit}
          </Typography>
        </Typography>
        <Typography variant="body2" className={classes.title}>
          Rheometer Readings (RPM/Dial Reading):
        </Typography>
        <Typography variant="body2" data-testid={`${PAGE_NAME}_rheometerReadings`}>
          {rheometerReadingsString}
        </Typography>
      </Grid>
    </Grid>
  );
};

FluidReportFeedItem.propTypes = {
  feedItem: shape({
    context: shape({
      fluid_report: shape({
        data: shape({
          depth: number.isRequired,
          mud_type: string.isRequired,
          mud_density: number.isRequired,
          viscosity: shape({
            pv: number.isRequired,
            yp: number.isRequired,
            rpm_readings: arrayOf(
              shape({
                id: string.isRequired,
                dial_reading: number.isRequired,
                rpm: number.isRequired,
              })
            ).isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default FluidReportFeedItem;
