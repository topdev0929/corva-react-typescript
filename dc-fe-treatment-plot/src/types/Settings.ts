export type SeriesSetting = {
  category: string;
  color: string;
  key: string;
  name: string;
  precision: number;
  unit: string;
  unitType: string;
};

export type ScaleSetting = {
  key: string;
  label: string;
  min: number;
  series: SeriesSetting[];
  unit: string;
  unitType: string;
};

export type TimeRange = {
  startValue: number;
  endValue: number;
};
