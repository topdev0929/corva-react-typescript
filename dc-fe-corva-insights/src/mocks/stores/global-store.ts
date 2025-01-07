import { GlobalStore } from '@/stores/global';
import { mockedUser } from '@/mocks/user';
import { APP_SIZE } from '@/shared/types';

export const mockedGlobalStore: GlobalStore = {
  appId: 1,
  user: mockedUser,
  currentUser: mockedUser,
  currentAssetId: 1,
  currentCompanyId: mockedUser.companyId,
  isAddInsightFormOpen: false,
  isInsightsDetailsFullscreenOpen: false,
  insightsDetailsMode: 'sidebar',
  appSize: APP_SIZE.DESKTOP,
  isNativeApp: false,
  setUser: jest.fn(),
  setCurrentUser: jest.fn(),
  setCurrentAssetId: jest.fn(),
  openAddInsightForm: jest.fn(),
  closeAddInsightForm: jest.fn(),
  setAppSize: jest.fn(),
  openFullscreenInsightsDetails: jest.fn(),
  closeFullscreenInsightsDetails: jest.fn(),
  markAsNativeApp: jest.fn(),
  markAsWebApp: jest.fn(),
  onInsightsRefreshed: jest.fn(),
  insightsRefreshed: 0,
};
