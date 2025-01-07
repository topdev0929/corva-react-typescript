export type GetDeductsFromScoreClass = (
  styles: Record<string, string>,
  score: number,
  isResolved: boolean
) => string;

export type GetDeductsFromScoreValue = (deductsFromScore: number, isResolved: boolean) => string;

type WellnessAlert = {
  id: string;
  assetId: number;
  name: string;
  category: string;
  lastCheckedAt: string;
  message: string;
  status: string;
  statusReason: string;
  statusUpdatedAt: string;
  state: string;
  createdAt: string;
  note: string;
  isThrottled: boolean;
  segment: string;
  metrics: {
    holeDepth?: number;
    state?: string;
  };
  deductsFromScore: boolean;
} | null;

export type ParseWellnessAlertFromJson = (obj: {
  _id: string;
  asset_id: number;
  data: {
    name: string;
    category: string;
    last_checked_at: string;
    message: string;
    status: string;
    status_reason: string;
    status_updated_at: string;
    state: string;
    note: string;
    is_throttled: boolean;
    segment: string;
    metrics?: {
      hole_depth?: number;
      state?: string;
    };
    deducts_from_score: boolean;
  };
  timestamp: string;
}) => WellnessAlert;
