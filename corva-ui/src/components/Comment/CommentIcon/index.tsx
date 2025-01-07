import PropTypes from 'prop-types';

import { Badge, IconButton, Tooltip, makeStyles } from '@material-ui/core';
import { isNativeDetected, isMobileDetected } from '~/utils/mobileDetect';

import Avatar from '../../Avatar';

import BadgeIcon from './BadgeIcon';

const isMobileView = isNativeDetected || isMobileDetected;

const useStyles = makeStyles(theme => ({
  icon: {
    padding: 0,
    '&:hover': {
      '& .MuiBadge-root .MuiBadge-badge svg path': {
        '&:first-of-type': { fill: theme.palette.primary.light },
      },
      '& .MuiAvatar-root': {
        outline: `1px solid ${theme.palette.primary.light}`,
      },
    },
    marginTop: 4,
  },
  badge: {
    top: 2,
    right: 6,
    '&:hover': {
      '& svg path': { '&:first-of-type': { fill: theme.palette.primary.light } },
    },
  },
  tooltip: {
    marginTop: 8,
  },
}));

interface CommentIconProps extends PropTypes.InferProps<typeof commentIconProps> {}

const CommentIcon = ({ displayName, imgSrc, size }: CommentIconProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Tooltip title={!isMobileView && "Add Comment"} placement="bottom" classes={{ tooltip: classes.tooltip }}>
      <IconButton classes={{ root: classes.icon }}>
        <Badge classes={{ badge: classes.badge }} badgeContent={<BadgeIcon />}>
          <Avatar displayName={displayName} size={size} imgSrc={imgSrc} />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

const commentIconProps = {
  displayName: PropTypes.string,
  imgSrc: PropTypes.string,
  size: PropTypes.number,
};

CommentIcon.propTypes = commentIconProps;

CommentIcon.defaultProps = {
  displayName: '',
  imgSrc: undefined,
  size: 24,
};

export default CommentIcon;
