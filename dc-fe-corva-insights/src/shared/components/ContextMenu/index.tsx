import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { FC, useMemo } from 'react';

const useStyles = makeStyles({
  menuItem: {
    color: '#DADADA',
    marginRight: '8px',
  },
  fileInput: {
    display: 'none',
  },
});

type Props = {
  x: number;
  y: number;
  onClose: () => void;
  onDownloadFile: () => void;
  testId?: string;
};

export const ContextMenu: FC<Props> = ({ x, y, onClose, onDownloadFile, testId }) => {
  const classes = useStyles();

  const items = useMemo(() => {
    return [{ text: 'Download', Icon: GetApp, onClick: onDownloadFile }];
  }, []);

  return (
    <Menu
      keepMounted
      open={y !== null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={y !== null && x !== null ? { top: y, left: x } : undefined}
    >
      {items.map(item => (
        <MenuItem onClick={item.onClick} key={item.text} data-testid={`${testId}_${item.text}`}>
          <item.Icon fontSize="small" className={classes.menuItem} />
          {item.text}
        </MenuItem>
      ))}
    </Menu>
  );
};
