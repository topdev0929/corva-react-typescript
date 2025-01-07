import { Theme } from './types';

export const useCommonDatePickerStyles = (theme: Theme) => ({
  paddingBottom: 0,
  '& .MuiSvgIcon-root': {
    fill: `${theme.palette.primary.text1} !important`,
  },
});
