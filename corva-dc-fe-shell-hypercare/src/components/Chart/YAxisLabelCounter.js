import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import { withStyles, makeStyles, Typography, Tooltip, Chip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  counterChip: {
    fontSize: '11px !important',
    lineHeight: '13px !important',
    width: '16px',
    height: '16px',
    '&>*': {
      padding: '0 !important',
    },
  },
  title: {
    fontSize: '11px',
    lineHeight: '16px',
    color: theme.palette.primary.text6,
    marginBottom: '4px',
  },
  content: {
    fontSize: '11px',
    lineHeight: '16px',
    color: theme.palette.primary.text1,
  },
}));

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: 'rgba(59, 59, 59, 0.9)',
    border: `1px solid ${theme.palette.primary.main}`,
    boxSizing: 'border-box',
    borderRadius: '4px',
    padding: '8px',
  },
}))(Tooltip);

function YAxisLabelCounter({ yAxis, channels }) {
  const classes = useStyles();

  const seriesCounts = useMemo(() => {
    if (!yAxis) return [];

    const MARGIN = 48;
    const result = yAxis
      .filter(axis => axis.series.length > 0)
      .map((axis, yAxisIndex) => {
        const series = axis.series[0];
        const { labelAlign: align, left, offset, width } = axis;
        return {
          id: series.name,
          name: series.name,
          top: axis.top - 4,
          left:
            align === 'right' ? left + offset - (MARGIN + 8) : left + offset + width + (MARGIN - 8),
          series: channels
            .filter(channel => channel.yAxisIndex === yAxisIndex)
            .map(channel => ({
              key: channel.traceName,
              name: channel.sensorName ? channel.sensorName : startCase(channel.traceName),
            })),
        };
      })
      .filter(item => item.series.length > 1);

    return result;
  }, [yAxis, channels]);

  return (
    <>
      {seriesCounts.map(item => (
        <StyledTooltip
          key={item.id}
          title={
            <>
              <Typography className={classes.title}>
                {item.series.length} Channels Plotted:
              </Typography>
              {item.series.map(item => (
                <Typography key={item.key} className={classes.content}>
                  {item.name}
                </Typography>
              ))}
            </>
          }
        >
          <Chip
            label={item.series.length}
            onClick={() => {}}
            className={classes.counterChip}
            style={{
              position: 'absolute',
              top: `${item.top}px`,
              left: `${item.left}px`,
            }}
          />
        </StyledTooltip>
      ))}
    </>
  );
}

YAxisLabelCounter.propTypes = {
  channels: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  yAxis: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default YAxisLabelCounter;
