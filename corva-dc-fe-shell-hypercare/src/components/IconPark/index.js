import classNames from 'classnames';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import Icon from '@icon-park/react/es/all';
import { makeStyles } from '@material-ui/core';

const ICON_SIZES = {
  small: 16,
  medium: 24,
};

const STROKE_WIDTH_BY_ICON_SIZE = {
  16: 4,
  24: 3,
};

const useStyles = makeStyles({
  iconWrapper: ({ iconSize }) => ({
    width: iconSize,
    height: iconSize,
  }),
});

function IconPark({ iconType, size, className, ...rest }) {
  const iconSize = typeof size === 'string' ? ICON_SIZES[size] : size;
  const strokeWidth = STROKE_WIDTH_BY_ICON_SIZE[iconSize];
  const classes = useStyles({ iconSize });

  return (
    <Icon
      strokeWidth={strokeWidth}
      {...rest}
      type={iconType}
      className={classNames(classes.iconWrapper, className)}
      size={iconSize}
    />
  );
}

IconPark.propTypes = {
  iconType: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
  className: PropTypes.string.isRequired,
};

IconPark.defaultProps = {
  size: 'small',
};

export default IconPark;
