export type WitsData = {
  wellhead_pressure: number;
  [key: string]: number;
  timestamp: number;
};

export type GroupedWitsData = {
  asset_id: number;
  asset_name: string;
  stage_number: number;
  wits: WitsData[];
};
