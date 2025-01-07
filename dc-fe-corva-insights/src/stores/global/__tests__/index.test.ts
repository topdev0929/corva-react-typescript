import { AssetId } from '@/entities/asset';
import { APP_SIZE } from '@/shared/types';
import { NativeEventsChannel } from '@/shared/services/native-events-channel';
import { mockedUser } from '@/mocks/user';

import { GlobalStoreImpl } from '../index';

describe('GlobalStore', () => {
  let store: GlobalStoreImpl;
  let assetId: AssetId;
  let appId: number;
  let mockedNativeEventsChannel: NativeEventsChannel;

  beforeEach(() => {
    assetId = 1;
    appId = 1;
    mockedNativeEventsChannel = {
      send: jest.fn(),
    } as unknown as NativeEventsChannel;
    store = new GlobalStoreImpl(assetId, mockedUser, mockedUser, mockedNativeEventsChannel, appId);
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(store.currentAssetId).toEqual(assetId);
    expect(store.appId).toEqual(appId);
    expect(store.currentUser).toEqual(mockedUser);
    expect(store.user).toEqual(mockedUser);
    expect(store.isAddInsightFormOpen).toEqual(false);
    expect(store.isInsightsDetailsFullscreenOpen).toEqual(false);
    expect(store.insightsDetailsMode).toEqual('sidebar');
    expect(store.appSize).toEqual(APP_SIZE.DESKTOP);
    expect(store.isNativeApp).toEqual(false);
  });

  it('should return current company id', () => {
    expect(store.currentCompanyId).toEqual(mockedUser.companyId);
  });

  it('should set current asset id', () => {
    const newAssetId = 2;
    store.setCurrentAssetId(newAssetId);
    expect(store.currentAssetId).toEqual(newAssetId);
  });

  it('should set user', () => {
    const newUser = { ...mockedUser, id: 2 };
    store.setUser(newUser);
    expect(store.user).toEqual(newUser);
  });

  describe('openAddInsightForm', () => {
    it('should open add insight form', () => {
      store.openAddInsightForm();
      expect(store.isAddInsightFormOpen).toEqual(true);
    });

    it('should open native add insight form', () => {
      store.markAsNativeApp();
      store.openAddInsightForm();

      expect(mockedNativeEventsChannel.send).toHaveBeenCalledWith(`createInsight#${assetId}`);
      expect(store.isAddInsightFormOpen).toEqual(false);
    });
  });

  it('should close add insight form', () => {
    store.openAddInsightForm();
    store.closeAddInsightForm();
    expect(store.isAddInsightFormOpen).toEqual(false);
  });

  it('should mark app as native', () => {
    store.markAsNativeApp();
    expect(store.isNativeApp).toEqual(true);
  });

  it('should mark app as web', () => {
    store.markAsNativeApp();
    store.markAsWebApp();
    expect(store.isNativeApp).toEqual(false);
  });

  describe('openFullscreenInsightsDetails', () => {
    it('should open fullscreen insights details', () => {
      store.setAppSize(450);
      store.openFullscreenInsightsDetails();
      expect(store.isInsightsDetailsFullscreenOpen).toEqual(true);
    });

    it('should not open fullscreen insights details if app size is not desktop', () => {
      store.openFullscreenInsightsDetails();
      expect(store.isInsightsDetailsFullscreenOpen).toEqual(false);
    });
  });

  describe('closeFullscreenInsightsDetails', () => {
    it('should close fullscreen insights details', () => {
      store.openFullscreenInsightsDetails();
      store.closeFullscreenInsightsDetails();
      expect(store.isInsightsDetailsFullscreenOpen).toEqual(false);
    });
  });

  describe('setAppSize', () => {
    it('should set app size to desktop', () => {
      store.setAppSize(1000);
      expect(store.appSize).toEqual(APP_SIZE.DESKTOP);
    });

    it('should set app size to tablet', () => {
      store.setAppSize(700);
      expect(store.appSize).toEqual(APP_SIZE.TABLET);
    });

    it('should set app size to mobile', () => {
      store.setAppSize(450);
      expect(store.appSize).toEqual(APP_SIZE.MOBILE);
    });

    it('should set app size to small mobile', () => {
      store.setAppSize(300);
      expect(store.appSize).toEqual(APP_SIZE.MOBILE_SM);
    });
  });
});
