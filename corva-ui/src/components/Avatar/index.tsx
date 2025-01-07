import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import Tooltip from '~/components/Tooltip';

import utils from '~/utils/main';
import palette from '../../config/theme/palette.mjs';

const getFontSize = (size: number) => {
  switch (size) {
    case 24:
      return 12;
    case 32:
      return 14;
    case 40:
      return 16;
    case 48:
      return 20;
    case 128:
      return 64;
    case 200:
      return 80;
    default:
      return Math.floor(size / 2);
  }
};

const styles = {
  size: (size: number) => ({
    minWidth: size,
    width: size,
    height: size,
    lineHeight: `${size}px`,
    fontSize: getFontSize(size),
  }),
};

const colors = [
  palette.pastel.p1,
  palette.pastel.p2,
  palette.pastel.p3,
  palette.pastel.p4,
  palette.pastel.p5,
  palette.pastel.p6,
  palette.pastel.p7,
  palette.pastel.p8,
  palette.pastel.p9,
  palette.pastel.p10,
  palette.pastel.p11,
  palette.pastel.p12,
  palette.pastel.p13,
  palette.pastel.p14,
  palette.pastel.p15,
  palette.pastel.p16,
];

const getColor = (displayName: string) => {
  return colors[Math.abs(utils.hashCode(displayName) % colors.length)];
};

type AvatarComponentProps = PropTypes.InferProps<typeof avatarComponentPropTypes>;

export const AvatarComponent = ({
  displayName,
  showTooltip,
  size,
  className,
  imgSrc,
  alt,
  classes,
  'data-testid': dataTestId,
}: AvatarComponentProps): JSX.Element => (
  <Tooltip
    title={displayName}
    disableFocusListener={!showTooltip}
    disableHoverListener={!showTooltip}
    disableTouchListener={!showTooltip}
  >
    <Avatar
      data-testid={dataTestId}
      alt={alt}
      src={imgSrc}
      className={classNames(classes.avatar, className)}
      // NOTE: Here we are using inline-styles because currently MUI
      // not supports passing props into style object
      style={{
        ...styles.size(Number(size)),
        backgroundColor: !!displayName && getColor(displayName),
      }}
    >
      {displayName ? utils.getNameInitials(displayName) : null}
    </Avatar>
  </Tooltip>
);

const avatarComponentPropTypes = {
  displayName: PropTypes.string,
  showTooltip: PropTypes.bool,
  size: PropTypes.number,
  className: PropTypes.string,
  imgSrc: PropTypes.string,
  alt: PropTypes.string,
  'data-testid': PropTypes.string,
  classes: PropTypes.shape({
    avatar: PropTypes.string,
  }).isRequired,
};

AvatarComponent.propTypes = avatarComponentPropTypes;

AvatarComponent.defaultProps = {
  displayName: '',
  showTooltip: false,
  size: 32,
  className: undefined,
  imgSrc: undefined,
  alt: undefined,
  'data-testid': 'generic_avatar',
};

export default withStyles(theme => ({
  avatar: {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}))(AvatarComponent);
