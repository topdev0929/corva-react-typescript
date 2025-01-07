import PropTypes from 'prop-types';
import classNames from 'classnames';
import { capitalize } from 'lodash';

import { Chip as MuiChip, ChipProps as MuiChipProps, makeStyles, Tooltip } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  rootChip: {
    '&.MuiChip-root': {
      backgroundColor: theme.palette.background.b9,
      color: theme.palette.primary.text6,
      textAlign: 'center',

      '&:hover': {
        color: theme.palette.primary.contrastText,

        '& .MuiSvgIcon-root': {
          color: theme.palette.primary.contrastText,
        },
      },
      '& span.MuiChip-label': {
        padding: 0,
      },
    },
  },
  tooltip: {
    marginTop: '10px',
  },
  closeIcon: {
    '&.MuiSvgIcon-root.MuiChip-deleteIcon': {
      width: 16,
      height: 16,
      left: 18,
      top: 4,
      margin: '0px 0px 0px 4px',
      color: theme.palette.primary.text6,
    },
  },

  sizeSmall: {
    '&.MuiChip-root': {
      minWidth: 16,
      height: 16,
      padding: '1px 2px',
      '& span': {
        fontSize: '11px',
        lineHeight: '14px',
      },
    },
  },
  sizeSmallLimited: {
    '&.MuiChip-root': {
      padding: '1px 3px',
    },
  },

  sizeMedium: {
    '&.MuiChip-root': {
      minWidth: 24,
      height: 24,
      padding: '2px 4px',
      '& span': {
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
  },
  sizeMediumLimited: {
    '&.MuiChip-root': {
      padding: '2px 6px',
    },
  },
  sizeMediumClickable: {
    '&.MuiChip-root': {
      padding: '2px 6px',
    },
  },

  sizeLarge: {
    '&.MuiChip-root': {
      minWidth: 32,
      height: 32,
      padding: '5px 7px',
      '& span': {
        fontSize: '16px',
        lineHeight: '22px',
      },
    },
  },
  sizeLargeLimited: {
    '&.MuiChip-root': {
      padding: '5px 8px',
    },
  },
  sizeLargeClickable: {
    '&.MuiChip-root': {
      padding: '5px 8px',
    },
  },
}));

interface CounterProps extends Omit<MuiChipProps, 'classes' | 'size' | 'label'>, PropTypes.InferProps<typeof counterPropTypes> {
  size?: 'small' | 'medium' | 'large';
}

const Counter = (props: CounterProps): JSX.Element => {
  const { classes, size, limited, clickable, tooltip } = props;

  const styles = useStyles();

  return (
    <Tooltip title={tooltip} classes={{ tooltip: styles.tooltip }}>
      <MuiChip
        {...props as MuiChipProps}
        classes={{
          ...classes,
          root: classNames(
            classes.root,
            styles.rootChip,
            styles[`size${capitalize(size)}`],
            limited && styles[`size${capitalize(size)}Limited`],
            clickable && styles[`size${capitalize(size)}Clickable`]
          ),
        }}
        clickable={clickable}
        deleteIcon={<CloseIcon className={styles.closeIcon} fontSize="small" />}
      />
    </Tooltip>
  );
};

const counterPropTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
  }),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  limited: PropTypes.bool,
  clickable: PropTypes.bool,
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
};

Counter.propTypes = counterPropTypes;

Counter.defaultProps = {
  classes: {},
  size: 'medium',
  limited: false,
  clickable: false,
  tooltip: '',
};

export default Counter;
