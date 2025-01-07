import { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { groupBy, startCase, xor } from 'lodash';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  legendWrapper: ({ marginLeft, marginRight }) => ({
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    rowGap: '4px',
    marginTop: '8px',
    marginLeft,
    marginRight,
    color: theme.palette.primary.text6,
    fontSize: '11px',
    lineHeight: '14px',
  }),
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '12px',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.text1,
    },
  },
  invisibleItem: {
    color: theme.palette.primary.text9,
    '& > $traceMark': {
      backgroundColor: `${theme.palette.primary.text9} !important`,
    },
  },
  traceMark: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginRight: '4px',
  },
  phaseMark: {
    width: '20px',
    height: '8px',
    borderRadius: '1px',
  },
}));

const TRACE_LEGEND = 1;
const PHASE_LEGEND = 2;
function Legend({
  marginLeft,
  marginRight,
  channels,
  phases,
  invisibleLegends,
  onAppSettingChange,
}) {
  const classes = useStyles({ marginLeft, marginRight });

  const legends = useMemo(() => {
    const traceLegends = channels.map(channel => {
      const { sensorName, traceName, displayName, color } = channel;
      const key = sensorName ? `${sensorName}_${traceName}` : traceName;
      return {
        key,
        name:
          displayName ||
          (sensorName ? `${startCase(traceName)} | ${sensorName}` : startCase(traceName)),
        color,
        type: TRACE_LEGEND,
      };
    });

    const groupedPhases = groupBy(phases, 'name');
    const phaseLegends = Object.keys(groupedPhases).map(name => ({
      key: name,
      name,
      color: groupedPhases[name][0].color,
      type: PHASE_LEGEND,
    }));

    return traceLegends.concat(phaseLegends);
  }, [channels, phases, invisibleLegends]);

  const handleLegendItemClick = name => {
    onAppSettingChange('invisible_legends', xor(invisibleLegends, [name]));
  };

  return (
    <div className={classes.legendWrapper}>
      {legends?.map(legend => (
        <div
          key={legend.key}
          className={classnames(classes.legendItem, {
            [classes.invisibleItem]: invisibleLegends.includes(legend.key),
          })}
          onClick={() => handleLegendItemClick(legend.key)}
        >
          <div
            className={classnames(classes.traceMark, {
              [classes.phaseMark]: legend.type === PHASE_LEGEND,
            })}
            style={{ backgroundColor: legend.color }}
          />
          <span>{legend.name}</span>
        </div>
      ))}
    </div>
  );
}

Legend.propTypes = {
  marginLeft: PropTypes.number.isRequired,
  marginRight: PropTypes.number.isRequired,
  channels: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  phases: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  invisibleLegends: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAppSettingChange: PropTypes.func.isRequired,
};

export default Legend;
