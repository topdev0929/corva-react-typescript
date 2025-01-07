import { CSSProperties } from 'react';

declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    status: {
      danger: CSSProperties['color'],
    };
    isLightTheme: boolean;
  }
  interface ThemeOptions {
    status: {
      danger: CSSProperties['color']
    }
    isLightTheme: boolean;
  }
}

declare module "@material-ui/core/styles/createPalette" {
  interface PaletteColor {
    text1?: string;
    text6?: string;
    text7?: string;
    text8?: string;
    text9?: string;
    bright?: string;
  }
  interface PaletteOptions {
    primary: {
      text1?: string;
      text6?: string;
      text7?: string;
      text8?: string;
      text9?: string;
    },
    success: {
      bright?: string;
    }
    background: Partial<TypeBackground>;
  }
  interface TypeBackground {
    b1: string;
    b2: string;
    b3: string;
    b4: string;
    b5: string;
    b6: string;
    b7: string;
    b8: string;
    b9: string;
    b10: string;
    b11: string;
  }
}
