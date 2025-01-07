import { FC, useEffect, useState } from 'react';
import { Chip as MuiChip, makeStyles, Typography } from '@material-ui/core';
import {
  Done as DoneIcon,
  Warning as WarningIcon,
  InfoOutlined as InfoIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from '@material-ui/icons';

import { DropdownIcon } from '../icons/DropdownIcon';

import { styles } from './styles';

import { Status } from '@/types/global.type';
import { StatusBGColor, StatusBorderColor } from '@/constants/color.const';

type ChipStyleProps = {
  status: Status;
  active: boolean;
  isStatusChip: boolean;
};

type ChipProps = {
  status?: Status;
  active?: boolean;
  label: string;
  isStatusChip?: boolean;
  editStatus?: boolean;
  disable?: boolean;
  setOpenDropdown?: () => void;
  onClick?: () => void;
};

const useStyles = makeStyles({
  root: ({ active, status, isStatusChip }: ChipStyleProps) => ({
    backgroundColor: active ? `${StatusBGColor[status]} !important` : 'transparent !important',
    border: `1px solid ${active ? StatusBGColor[status] : StatusBorderColor[status]}`,
    borderRadius: '40px',
    cursor: 'pointer',
    ...(isStatusChip && { height: '24px', justifyContent: 'flex-start' }),
  }),
});

export const Chip: FC<ChipProps> = ({
  status = Status.Done,
  active = false,
  label,
  isStatusChip = false,
  editStatus = false,
  disable = false,
  onClick,
}) => {
  const classes = useStyles({ status, active, isStatusChip });
  const [icon, setIcon] = useState<JSX.Element>(<DoneIcon style={styles.icon} />);

  useEffect(() => {
    let iconComponent: JSX.Element;

    if (isStatusChip) {
      iconComponent = (
        <FiberManualRecordIcon
          data-testid="status-icon"
          style={{
            ...styles.icon,
            color: StatusBGColor[status],
          }}
        />
      );
    } else {
      const iconColor = active ? 'white' : StatusBGColor[status];
      const iconStyle = { ...styles.icon, color: iconColor };
      switch (status) {
        case Status.Critical:
          iconComponent = <WarningIcon style={iconStyle} />;
          break;
        case Status.Medium:
          iconComponent = <WarningIcon style={iconStyle} />;
          break;
        case Status.Info:
          iconComponent = <InfoIcon style={iconStyle} />;
          break;
        default:
          iconComponent = <DoneIcon data-testid="default-icon" style={iconStyle} />;
          break;
      }
    }

    setIcon(iconComponent);
  }, [status, active, isStatusChip]);

  return (
    <MuiChip
      classes={{ root: classes.root }}
      icon={icon}
      label={
        <Typography
          style={{
            ...styles.iconLabel,
            ...(!isStatusChip && { color: 'white' }),
          }}
        >
          {label}
          {editStatus && <DropdownIcon />}
        </Typography>
      }
      onClick={onClick}
      disabled={disable ? !editStatus : false}
    />
  );
};
