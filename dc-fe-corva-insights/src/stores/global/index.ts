import { action, computed, makeObservable, observable } from 'mobx';
import moment from 'moment';

import { User } from '@/entities/user';
import { AssetId } from '@/entities/asset';
import { APP_SIZE } from '@/shared/types';
import { NativeEventsChannel } from '@/shared/services/native-events-channel';
import { SCREEN_BREAKPOINTS } from '@/constants';

import { GlobalStore } from './types';

export * from './types';

export class GlobalStoreImpl implements GlobalStore {
  @observable currentAssetId: AssetId;
  @observable insightsRefreshed = 0;
  @observable user: User;
  @observable currentUser: any;
  @observable isAddInsightFormOpen = false;
  @observable isInsightsDetailsFullscreenOpen = false;
  @observable appId: number;
  @observable appSize: APP_SIZE = APP_SIZE.DESKTOP;
  @observable isNativeApp = false;
  #nativeEventsChannel: NativeEventsChannel;

  constructor(
    assetId: AssetId,
    user: User,
    currentUser: any,
    nativeEventsChannel: NativeEventsChannel,
    appId: number
  ) {
    this.currentAssetId = assetId;
    this.user = user;
    this.currentUser = currentUser;
    this.appId = appId;
    this.#nativeEventsChannel = nativeEventsChannel;
    makeObservable(this);
  }

  @computed
  get currentCompanyId() {
    return this.user.companyId;
  }

  @computed
  get insightsDetailsMode() {
    return this.appSize !== APP_SIZE.DESKTOP ? 'fullscreen' : 'sidebar';
  }

  @action
  setCurrentAssetId(assetId: AssetId) {
    this.currentAssetId = assetId;
  }

  @action
  setUser(user: User) {
    this.user = user;
  }

  @action
  setCurrentUser(currentUser: any) {
    this.currentUser = currentUser;
  }

  @action
  onInsightsRefreshed() {
    this.insightsRefreshed = moment().valueOf();
  }

  @action
  openAddInsightForm() {
    if (!this.isNativeApp) {
      this.isAddInsightFormOpen = true;
    } else {
      this.#nativeEventsChannel.send(`createInsight#${this.currentAssetId}`);
    }
  }

  @action
  closeAddInsightForm() {
    this.isAddInsightFormOpen = false;
  }

  @action
  openFullscreenInsightsDetails() {
    if (!this.#checkFullscreenInsightsPreConditions()) return;
    this.isInsightsDetailsFullscreenOpen = true;
  }

  @action
  closeFullscreenInsightsDetails() {
    this.isInsightsDetailsFullscreenOpen = false;
  }

  @action
  setAppId(appId) {
    this.appId = appId;
  }

  @action
  setAppSize(width: number) {
    if (width <= SCREEN_BREAKPOINTS.MOBILE_SM) {
      this.appSize = APP_SIZE.MOBILE_SM;
    } else if (width <= SCREEN_BREAKPOINTS.MOBILE) {
      this.appSize = APP_SIZE.MOBILE;
    } else if (width <= SCREEN_BREAKPOINTS.TABLET) {
      this.appSize = APP_SIZE.TABLET;
    } else {
      this.appSize = APP_SIZE.DESKTOP;
    }
  }

  @action
  markAsNativeApp() {
    this.isNativeApp = true;
  }

  @action
  markAsWebApp() {
    this.isNativeApp = false;
  }

  #checkFullscreenInsightsPreConditions() {
    return this.insightsDetailsMode === 'fullscreen';
  }
}
