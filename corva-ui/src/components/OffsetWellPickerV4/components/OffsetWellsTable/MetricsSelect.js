import PropTypes from 'prop-types';
import { MenuItem, FormControl, makeStyles, Typography, Tooltip } from '@material-ui/core';
import { getUnitDisplay } from '~/utils';
import SelectComponent from '~/components/Select';
import { DEFAULT_METRICS_KEY, METRICS_LIST } from '../../constants';

const PAGE_NAME = 'MetricsSelect';

const useStyles = makeStyles(theme => ({
  metricsForm: {
    width: 'calc(100% - 32px)',
    '& .MuiInputBase-root': {
      '&:hover $primaryText': {
        color: theme.palette.primary.text1,
      },
      '&:hover $primaryIcon': {
        color: theme.palette.primary.text1,
      },
      '&:focused $primaryIcon': {
        color: theme.palette.primary.main,
      },
    },
  },
  metricsSelect: {
    '&:before': {
      borderBottom: 'none !important',
    },
    '&:after': {
      borderBottom: 'none !important',
    },
  },
  primaryText: {
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '14px',
    letterSpacing: '0.4px',
    color: theme.palette.primary.text7,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  primaryIcon: {
    color: theme.palette.primary.text6,
  },
  metricsMenuPaper: {
    backgroundColor: theme.palette.background.b9,
    maxHeight: 'calc(100% - 300px)',
    top: '150px !important',
  },
  valueLabel: {
    display: '-webkit-box',
    alignItems: 'center',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflowWrap: 'break-word',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '14px',
    letterSpacing: '0.4px',
    overflow: 'hidden',
    whiteSpace: 'normal',
  },
}));

function getMetricsLabel(value) {
  const metric = METRICS_LIST.find(item => item.key === value);
  if (!metric) return '';
  const displayUnit = metric.unitType ? ` (${getUnitDisplay(metric.unitType)})` : '';
  return metric.label + displayUnit;
}

export const MetricsSelect = ({
  isTooltipVisible,
  currentValue,
  metricsKeys,
  onChange,
  setIsMenuOpen,
}) => {
  const styles = useStyles();
  const filteredMetrics = METRICS_LIST.filter(item => !metricsKeys.includes(item.key));
  return currentValue !== DEFAULT_METRICS_KEY ? (
    <FormControl className={styles.metricsForm}>
      <SelectComponent
        data-testid={`${PAGE_NAME}_select_${currentValue}`}
        className={styles.metricsSelect}
        classes={{ select: styles.primaryText, icon: styles.primaryIcon }}
        MenuProps={{ paper: styles.metricsMenuPaper }}
        value={currentValue}
        renderValue={value => (
          <Tooltip title={isTooltipVisible ? getMetricsLabel(value) : ''}>
            <Typography className={styles.valueLabel}>{getMetricsLabel(value)}</Typography>
          </Tooltip>
        )}
        onOpen={() => setIsMenuOpen(true)}
        onClose={() => setIsMenuOpen(false)}
        onChange={e => onChange(e.target.value)}
      >
        {filteredMetrics.map(item => (
          <MenuItem
            data-testid={`${PAGE_NAME}_option_${item.key}MenuItem`}
            key={item.key}
            value={item.key}
          >
            {item.label}
          </MenuItem>
        ))}
      </SelectComponent>
    </FormControl>
  ) : (
    <Tooltip title={isTooltipVisible ? getMetricsLabel(currentValue) : ''}>
      <Typography className={styles.valueLabel}>{getMetricsLabel(currentValue)}</Typography>
    </Tooltip>
  );
};

MetricsSelect.propTypes = {
  isTooltipVisible: PropTypes.bool.isRequired,
  currentValue: PropTypes.string.isRequired,
  metricsKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  setIsMenuOpen: PropTypes.func.isRequired,
};
