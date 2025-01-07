export type OffsetWell = {
  selectedStages: number[];
  selectedWellId: number;
  selectedWellName: string;
  selectedWellStatus: string;
};

export type FracFleet = {
  type: string;
  id: string;
  name: string;
  current_pad_id: number;
  // eslint-disable-next-line no-undef
  pad_frac_fleets: Record<string, any>[];
};

export type Well = {
  asset_id: number;
  name: string;
  status: string;
  id?: string;
  last_active_at?: string;
  last_wireline_at?: string;
  is_active?: boolean;
  rig?: string;
  companyId?: string;
};
