import { Avatar, IconButton } from '@corva/ui/components';
import { FC } from 'react';
import { Badge } from '@material-ui/core';

import { useStyles } from './styles';
import { BadgeIcon } from './BadgeIcon';

type Props = {
  displayName: string;
  imgSrc?: string;
  onClick?: () => void;
  size?: number;
};

export const CommentIcon: FC<Props> = ({ displayName, imgSrc, size = 24, onClick }) => {
  const classes = useStyles();

  return (
    <IconButton
      onClick={onClick}
      classes={{ root: classes.icon }}
      tooltipProps={{ title: 'Add Comment' }}
    >
      <Badge classes={{ badge: classes.badge }} badgeContent={<BadgeIcon />}>
        <Avatar displayName={displayName} size={size} imgSrc={imgSrc} />
      </Badge>
    </IconButton>
  );
};
