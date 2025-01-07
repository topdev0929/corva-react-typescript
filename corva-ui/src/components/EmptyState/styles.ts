import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { SIZES } from './constants';

type makeStylesProps = { size: string; image: string };

export const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      flexGrow: 1,
    },
    content: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: 24,
      textAlign: 'center',
    },
    title: ({ size }: makeStylesProps) => ({
      color: palette.primary.text7,
      fontStyle: 'italic',
      fontSize: size === SIZES.LARGE ? 32 : 24,
      lineHeight: size === SIZES.LARGE ? '38px' : '28px',
      marginBottom: 8,
    }),
    subtitle: ({ size }: makeStylesProps) => ({
      color: palette.primary.text7,
      fontSize: size === SIZES.LARGE ? 16 : 14,
      lineHeight: size === SIZES.LARGE ? '22px' : '20px',
      marginBottom: 24,
    }),
    image: ({ size, image }: makeStylesProps) => ({
      display: 'flex',
      flexGrow: 1,
      maxHeight: size === SIZES.LARGE ? 300 : 200,
      objectFit: 'contain',
      width: '100%',
      backgroundImage: `url(${image})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
    }),
  })
);
