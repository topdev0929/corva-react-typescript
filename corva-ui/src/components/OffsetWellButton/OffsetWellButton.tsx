import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Typography, makeStyles, Tooltip } from '@material-ui/core';
import {
  Edit as EditIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from '@material-ui/icons';
import IconButton from '~/components/IconButton';

const useStyles = makeStyles(({ palette }) => ({
  disabled: {
    opacity: 0.4,
    pointerEvents: 'none',
  },
  offsetContainer: {
    cursor: 'pointer',
    display: 'flex',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
    alignItems: 'center',
    width: 'fit-content',
  },
  hoveredContainer: {
    backgroundColor: 'rgba(3, 188, 212, 0.16)',
  },
  offsetText: {
    color: palette.primary.text6,
    fontSize: 12,
    paddingRight: 4,
    '&:hover': {
      color: palette.primary.contrastText,
    },
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
  },
  isActive: {
    color: palette.primary.contrastText,
  },
  primaryIcon: {
    '&:hover': {
      backgroundColor: 'rgba(3, 188, 212, 0.16)',
    },
  },
  infoIcon: {
    marginRight: '8px',
    fontSize: '20px',
    color: palette.info.light,
  },
  infoTooltip: {
    maxWidth: '264px',
  },
}));

type OffsetWellButtonProps = PropTypes.InferProps<typeof offsetWellButtonPropTypes>;

const OffsetWellButton = ({
  onClick,
  wells,
  disabled,
  expanded,
  onExpand,
  offsetWellsLimited,
  isTooltipDisabled,
}: OffsetWellButtonProps): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useStyles();

  const wellsCount = wells.length;
  const canBeExpanded = !!(wellsCount && onExpand);

  const handleWellsExpand = event => {
    event.stopPropagation();
    onExpand();
  };

  const handleButtonHover = ({ target }) => {
    const { parentNode } = target;
    if (target.getAttribute('data-icon') || parentNode.getAttribute('data-icon')) {
      setIsHovered(false);
      return;
    }

    setIsHovered(true);
  };

  const handleButtonHoverLeave = () => {
    setIsHovered(false);
  };

  const editButtonContent = (
    <div
      className={classNames(styles.offsetContainer, disabled && styles.disabled)}
      onClick={onClick}
      onMouseMove={handleButtonHover}
      onMouseLeave={handleButtonHoverLeave}
    >
      <Typography className={classNames(styles.offsetText, isHovered && styles.isActive)}>
        Offset Wells ({wellsCount})
      </Typography>
      <IconButton
        className={classNames(styles.primaryIcon, isHovered && styles.hoveredContainer)}
        color="primary"
        size="medium"
      >
        <EditIcon />
      </IconButton>
    </div>
  );

  return (
    <div className={styles.buttons}>
      {offsetWellsLimited && (
        <Tooltip
          title="Offset wells list wasn't populated completely due to technical limitations of the app."
          classes={{ tooltip: styles.infoTooltip }}
        >
          <InfoIcon className={styles.infoIcon} />
        </Tooltip>
      )}
      <Tooltip title="Edit Offset Wells" placement="bottom">
        {editButtonContent}
      </Tooltip>
      {canBeExpanded && (
        <IconButton
          tooltipProps={
            !isTooltipDisabled && {
              title: expanded ? 'Collapse Offset Wells' : 'Expand Offset Wells',
            }
          }
          onClick={handleWellsExpand}
          color="default"
          size="medium"
          data-icon="expandIcon"
        >
          {expanded ? (
            <ExpandLessIcon data-icon="expandIcon" />
          ) : (
            <ExpandMoreIcon data-icon="expandIcon" />
          )}
        </IconButton>
      )}
    </div>
  );
};

const offsetWellButtonPropTypes = {
  onClick: PropTypes.func.isRequired,
  wells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ),
  disabled: PropTypes.bool,
  onExpand: PropTypes.func,
  expanded: PropTypes.bool,
  offsetWellsLimited: PropTypes.bool,
  isTooltipDisabled: PropTypes.bool,
};

OffsetWellButton.propTypes = offsetWellButtonPropTypes;

OffsetWellButton.defaultProps = {
  onExpand: null,
  expanded: false,
  wells: [],
  disabled: false,
  offsetWellsLimited: false,
  isTooltipDisabled: false,
};

export default OffsetWellButton;
