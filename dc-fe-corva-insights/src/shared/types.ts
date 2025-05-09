export type DateRange = {
  start: Date;
  end: Date;
};

export enum APP_SIZE {
  MOBILE_SM,
  MOBILE,
  TABLET,
  DESKTOP,
}

export type Theme = {
  isLightTheme: boolean;
  palette: {
    type: 'dark' | 'light';
    primary: {
      main: string;
      text1: string;
      text6: string;
      text7: string;
    };
    background: {
      b3: string;
      b4: string;
      b5: string;
      b6: string;
      b7: string;
      b8: string;
      b9: string;
      b11: string;
    };
    charts: {
      background: string;
      gaugeArrow: string;
    };
  };
};
