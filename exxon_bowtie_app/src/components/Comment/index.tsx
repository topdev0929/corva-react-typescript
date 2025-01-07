import { FC, useState } from 'react';
import { Typography, IconButton, Divider } from '@material-ui/core';
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import moment from 'moment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { styles } from './styles';

import user from '@/assets/user.png';
import { Status, TComment } from '@/types/global.type';
import { StatusBGColor } from '@/constants/color.const';

type CommentProps = {
  onDelete?: (index: number) => void;
  onEdit?: (index: number) => void;
  index?: number;
  comment: TComment;
};

const Comment: FC<CommentProps> = ({ onDelete, onEdit, index, comment }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const closeMenu = () => setAnchorEl(null);

  const toggleMenu = (event: { stopPropagation: () => void; currentTarget: any }) => {
    event.stopPropagation();
    const currentT = event.currentTarget;
    setAnchorEl((prevValue: any) => (prevValue ? null : currentT));
  };

  const handleDelete = () => {
    onDelete(index);
    closeMenu();
  };

  const handleEdit = () => {
    onEdit(index);
    closeMenu();
  };

  return (
    <div style={styles.relative}>
      <div style={styles.avatarWrapper}>
        <img style={styles.avatar} src={user} alt="Logo" />
        {(comment?.status === Status.Critical || comment?.status === Status.Medium) && (
          <WarningIcon
            data-testid="warning-icon"
            style={{
              ...styles.icon,
              color: StatusBGColor[comment?.status],
            }}
          />
        )}
        {comment?.status === Status.Info && (
          <InfoIcon
            data-testid="info-icon"
            style={{
              ...styles.icon,
              color: StatusBGColor[comment?.status],
            }}
          />
        )}
      </div>
      <div style={styles.commentWrapper}>
        <div style={styles.titleWrapper}>
          <Typography style={styles.title}>{comment?.title}</Typography>
          <div style={styles.dateWrapper}>
            <Typography style={styles.date}>
              {moment(comment?.time).format('MM/DD/YY HH:mm')}
            </Typography>
            <IconButton aria-label="close" style={styles.iconBtn} onClick={toggleMenu}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              id="c-comment__actions-menu"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={toggleMenu}
            >
              <MenuItem data-testid="editBtn" onClick={handleEdit}>
                Edit
              </MenuItem>
              <MenuItem data-testid="deleteBtn" onClick={handleDelete}>
                Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
        <Divider style={styles.divider} />
        <Typography style={styles.desc}>{comment?.description}</Typography>
      </div>
    </div>
  );
};

export default Comment;
