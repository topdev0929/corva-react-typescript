import { AssetId } from '@/entities/asset';
import { User } from '@/entities/user';
import { APP_SIZE } from '@/shared/types';

export interface GlobalStore {
  appId: number;
  user: User;
  currentUser: any;
  currentAssetId: AssetId;
  currentCompanyId: number;
  isAddInsightFormOpen: boolean;
  isInsightsDetailsFullscreenOpen: boolean;
  insightsDetailsMode: 'sidebar' | 'fullscreen';
  appSize: APP_SIZE;
  isNativeApp: boolean;
  setCurrentUser: (currentUser: any) => void;
  setUser: (user: User) => void;
  setCurrentAssetId: (id: AssetId) => void;
  openAddInsightForm: () => void;
  onInsightsRefreshed: () => void;
  closeAddInsightForm: () => void;
  openFullscreenInsightsDetails: () => void;
  closeFullscreenInsightsDetails: () => void;
  setAppSize: (width: number) => void;
  markAsNativeApp: () => void;
  markAsWebApp: () => void;
  insightsRefreshed: number;
}
