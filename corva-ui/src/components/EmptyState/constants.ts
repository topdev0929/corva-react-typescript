export enum SIZES {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const APP_MESSAGES = {
  appNotSubscribed: {
    title: 'No Subscription exists for this app.',
    subtitle: 'Contact your Corva Account rep to get access to this app.',
  },
  appNotSubscribedForAsset: {
    title: 'No Subscription exists for this asset.',
    subtitle: 'Contact your Corva Account rep to get access to this asset.',
  },
  internalAppError: {
    title: 'App Loading Error',
  },
  appPackageWasNotFound: {
    title: 'App package was not found',
    subtitle:
        'Please choose another version in the app settings menu or delete and add app again on your dashboard',
  },
  fracFleetWasNotFound: {
    title: 'Frac fleet was not found',
  },
  fracFleetHasNoPad: {
    title: 'Frac fleet has no active pad',
  },
  padHasNoWells: {
    title: 'This pad has no wells',
  },
  appComponentWasNotFound: {
    title: 'App component was not found',
  },
  noAssetData: {
    title: 'No asset data found',
  },
};