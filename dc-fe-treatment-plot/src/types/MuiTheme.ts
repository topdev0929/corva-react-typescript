import { Theme } from '@material-ui/core';
import { Palette, PaletteColor, TypeBackground } from '@material-ui/core/styles/createPalette';

interface PrimaryCustom extends PaletteColor {
  [key: string]: any;
}

interface BackgroundCustom extends TypeBackground {
  [key: string]: any;
}

interface PaletteCustom extends Palette {
  background: BackgroundCustom;
  primary: PrimaryCustom;
  success: PaletteColor & {
    bright: string;
  };
  [key: string]: any;
}

export interface MuiTheme extends Theme {
  palette: PaletteCustom;
  isLightTheme: boolean;
}
