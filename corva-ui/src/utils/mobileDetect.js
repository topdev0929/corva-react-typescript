import MobileDetect from 'mobile-detect';
import queryString from 'query-string';

const md = new MobileDetect(window.navigator.userAgent);
const { native, tablet } = queryString.parse(window.top.location.search);

export const isMobileDetected = !!md.mobile();
export const isTabletDetected = !!md.tablet();
export const isNativeDetected = !!native;
export const isNativeTabletDetected = isNativeDetected && !!tablet;

export const isPhoneDetected = !!md.phone();
