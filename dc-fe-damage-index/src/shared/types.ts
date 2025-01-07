export type Theme = {
  isLightTheme: boolean;
  palette: {
    type: 'dark' | 'light';
    primary: {
      text1: string;
      text6: string;
      text7: string;
    };
    background: {
      b3: string;
      b4: string;
      b5: string;
      b6: string;
      b11: string;
    };
    charts: {
      background: string;
      gaugeArrow: string;
    };
  };
};
