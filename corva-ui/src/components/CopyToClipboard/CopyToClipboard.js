import { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles, Tooltip } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import utils from '~/utils/main';

const useStyles = makeStyles(theme => ({
  icon: {
    cursor: 'pointer',
  },
  tooltip: {
    color: theme.palette.primary.text6,
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
  },
}));

const CopyToClipboard = ({ children, classes, dataTestId, IconComponent, tooltipProps }) => {
  const [isOpenedTooltip, setIsOpenedTooltip] = useState(false);
  const styles = useStyles();

  const handleCopyText = () => {
    setIsOpenedTooltip(true);
    utils.copyToClipboard(children);
  };

  useEffect(() => {
    const openedTooltipTimeout = setTimeout(() => {
      setIsOpenedTooltip(false);
    }, tooltipProps.delay);

    return () => clearTimeout(openedTooltipTimeout);
  }, [isOpenedTooltip]);

  return (
    <Tooltip
      classes={{
        tooltip: classNames(styles.tooltip, classes.tooltip),
        popper: classNames(styles.tooltipPopper, classes.tooltipPopper),
      }}
      title={tooltipProps.title}
      open={isOpenedTooltip}
      disableFocusListener
      disableHoverListener
      placement={tooltipProps.placement}
    >
      <IconComponent
        className={classNames(styles.icon, classes.icon)}
        data-testid={dataTestId}
        onClick={handleCopyText}
      />
    </Tooltip>
  );
};

CopyToClipboard.propTypes = {
  children: PropTypes.string.isRequired,
  dataTestId: PropTypes.string,
  IconComponent: PropTypes.shape({}),
  tooltipProps: PropTypes.shape({
    title: PropTypes.string,
    placement: PropTypes.string,
    delay: PropTypes.number,
  }),
  classes: PropTypes.shape({
    icon: PropTypes.string,
    tooltip: PropTypes.string,
    tooltipPopper: PropTypes.string,
  }),
};

CopyToClipboard.defaultProps = {
  dataTestId: null,
  IconComponent: FileCopyIcon,
  tooltipProps: {
    title: 'Copied',
    placement: 'top',
    delay: 1500,
  },
  classes: {},
};

export default CopyToClipboard;
