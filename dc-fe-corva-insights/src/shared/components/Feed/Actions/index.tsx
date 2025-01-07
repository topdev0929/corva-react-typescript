import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@corva/ui/components';
import { useState } from 'react';

import { Theme } from '@/shared/types';

const useStyles = makeStyles<Theme>(theme => ({
  actionsIconButtonRoot: {
    marginLeft: 5,
    color: theme.palette.primary.text7,
  },
}));

type Props = {
  onEdit?: () => void;
  onDeleteRequest?: () => void;
  testId?: string;
};

export const FeedActions = ({ onEdit, onDeleteRequest, testId }: Props) => {
  const classes = useStyles();
  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState(null);

  const handleToggleActionsMenu = event => {
    event.stopPropagation();
    const currentT = event.currentTarget;
    setActionsMenuAnchorEl(prevValue => (prevValue ? null : currentT));
  };

  return (
    <>
      <IconButton
        aria-label="Actions"
        aria-haspopup="true"
        className={classes.actionsIconButtonRoot}
        size="small"
        onClick={handleToggleActionsMenu}
        data-testid={`${testId}_openBtn`}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="c-feed-item__actions-menu"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={actionsMenuAnchorEl}
        open={!!actionsMenuAnchorEl}
        onClick={handleToggleActionsMenu}
      >
        {onEdit && (
          <MenuItem onClick={onEdit} data-testid={`${testId}_edit`}>
            Edit
          </MenuItem>
        )}
        {onDeleteRequest && (
          <MenuItem onClick={onDeleteRequest} data-testid={`${testId}_delete`}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
