/* eslint-disable react/jsx-key */
import { CSSProperties, FC, MouseEvent, useEffect, useState } from 'react';
import { Color } from 'highcharts';
import { Tooltip, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import {
  Done as DoneIcon,
  Warning as WarningIcon,
  InfoOutlined as InfoIcon,
} from '@material-ui/icons';

import { Status, TChip } from '@/types/global.type';
import { StatusBGColor, StatusBorderColor, StatusHoverColor } from '@/constants/color.const';

type sourceType = {
  [key: string]: {
    chips: TChip[];
    commentTabs: string[];
  };
};

type CardProps = {
  width?: string;
  height?: string;
  title: string;
  fontStyle?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
    lineHeight?: string;
  };
  source?: sourceType;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const Card: FC<CardProps> = ({
  width,
  height,
  title,
  source,
  fontStyle,
  onClick,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [color, setColor] = useState<Color>();
  const [borderColor, setBorderColor] = useState<Color>();
  const [hoverColor, setHoverColor] = useState<Color>();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (source) {
      const data = source[title];

      if (!data) {
        setColor(new Color('#272727'));
        setBorderColor(new Color('#616161'));
      } else {
        const criticalCount = data.chips.filter(item => item.status === Status.Critical).length;
        const mediumCount = data.chips.filter(item => item.status === Status.Medium).length;
        const infoCount = data.chips.filter(item => item.status === Status.Info).length;

        if (criticalCount) {
          setColor(new Color(StatusBGColor[Status.Critical]));
          setBorderColor(new Color(StatusBorderColor[Status.Critical]));
          setHoverColor(new Color(StatusHoverColor[Status.Critical]));
        } else if (mediumCount) {
          setColor(new Color(StatusBGColor[Status.Medium]));
          setBorderColor(new Color(StatusBorderColor[Status.Medium]));
          setHoverColor(new Color(StatusHoverColor[Status.Medium]));
        } else if (infoCount) {
          setColor(new Color(StatusBGColor[Status.Info]));
          setBorderColor(new Color(StatusBorderColor[Status.Info]));
          setHoverColor(new Color(StatusHoverColor[Status.Info]));
        } else {
          setColor(new Color(StatusBGColor[Status.Done]));
          setBorderColor(new Color(StatusBorderColor[Status.Done]));
          setHoverColor(new Color(StatusHoverColor[Status.Done]));
        }
      }
    }
  }, [source]);

  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width || 'inherit',
    height: height || '56px',
    // eslint-disable-next-line no-nested-ternary
    backgroundColor: isHovered
      ? source?.[title]
        ? (hoverColor || color)?.setOpacity(0.2).get()
        : 'transparent'
      : color?.setOpacity(0.03).get(),
    border: `1px ${source?.[title] ? 'dashed' : 'solid'} ${
      borderColor?.get() || color?.setOpacity(0.8).get()
    }`,
    borderRadius: '8px',
    padding: '10px',
    ...(source?.[title] && { cursor: 'pointer' }),
  } as CSSProperties;

  const titleStyle = {
    fontFamily: fontStyle?.fontFamily ?? 'Roboto',
    fontSize: fontStyle?.fontSize ?? '16px',
    fontWeight: fontStyle?.fontWeight ?? 400,
    lineHeight: fontStyle?.lineHeight ?? '18.75px',
    textAlign: 'center',
    margin: 0,
  } as CSSProperties;

  const tooltipStyles = {
    fontSize: '12px',
  } as CSSProperties;

  const imageIcon = (status: string) => {
    let iconComponent: JSX.Element;
    switch (status) {
      case Status.Critical:
        iconComponent = <WarningIcon style={{ color: StatusBGColor[status] }} />;
        break;
      case Status.Medium:
        iconComponent = <WarningIcon style={{ color: StatusBGColor[status] }} />;
        break;
      case Status.Info:
        iconComponent = <InfoIcon style={{ color: StatusBGColor[status] }} />;
        break;
      default:
        iconComponent = (
          <DoneIcon data-testid="default-icon" style={{ color: StatusBGColor[status] }} />
        );
        break;
    }
    return iconComponent;
  };

  const content = () => {
    const chips = source?.[title]?.chips;
    return chips?.map(chip => (
      <ListItem>
        <ListItemIcon>{imageIcon(chip.status)}</ListItemIcon>
        <ListItemText secondary={chip.label} />
      </ListItem>
    ));
  };

  return (
    <Tooltip title={content() || ''} style={tooltipStyles}>
      <div
        style={style}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        <p style={titleStyle}>{title}</p>
      </div>
    </Tooltip>
  );
};
