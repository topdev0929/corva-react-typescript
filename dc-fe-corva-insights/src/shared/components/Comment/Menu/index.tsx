import { FC, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton } from '@corva/ui/components';
import { MoreOne as MoreOneIcon } from '@icon-park/react';

type Props = {
  onDelete: () => void;
  onEdit: () => void;
  testId?: string;
};

export const CommentMenu: FC<Props> = ({ onDelete, onEdit, testId }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const closeMenu = () => setAnchorEl(null);

  const toggleMenu = event => {
    event.stopPropagation();
    const currentT = event.currentTarget;
    setAnchorEl(prevValue => (prevValue ? null : currentT));
  };

  const handleDelete = () => {
    onDelete();
    closeMenu();
  };

  const handleEdit = () => {
    onEdit();
    closeMenu();
  };

  return (
    <>
      <IconButton
        data-testid={`${testId}_menuBtn`}
        aria-label="Actions"
        aria-haspopup="true"
        size="small"
        onClick={toggleMenu}
      >
        <MoreOneIcon />
      </IconButton>

      <Menu
        id="c-comment__actions-menu"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={toggleMenu}
      >
        <MenuItem data-testid={`${testId}_editBtn`} onClick={handleEdit}>
          Edit
        </MenuItem>
        <MenuItem data-testid={`${testId}_deleteBtn`} onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
