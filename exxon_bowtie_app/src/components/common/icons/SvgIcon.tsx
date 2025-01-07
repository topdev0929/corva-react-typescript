import { FC, PropsWithChildren } from 'react';
import { SvgIcon as MuiSvgIcon, SvgIconProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export interface ISvgIcon extends Omit<SvgIconProps, 'color'> {
  color?: string;
}

const useStyles = makeStyles({
  root: (props: ISvgIcon) => ({
    color: props.color || 'white',
    width: `${props.width}px` || '24px',
    height: `${props.height}px` || '24px',
    fill: props.fill || 'currentColor',
    ...(props.style?.position && { position: props.style?.position }),
    ...(props.style?.top && { top: props.style?.top }),
    ...(props.style?.left && { left: props.style?.left }),
    ...(props.style?.right && { right: props.style?.right }),
  }),
});

const SvgIcon: FC<PropsWithChildren<ISvgIcon>> = props => {
  const { height, width, children } = props;
  const classes = useStyles(props);
  return (
    <MuiSvgIcon viewBox={`0 0 ${width || 24} ${height || 24}`} classes={{ root: classes.root }}>
      {children}
    </MuiSvgIcon>
  );
};

export { SvgIcon };
