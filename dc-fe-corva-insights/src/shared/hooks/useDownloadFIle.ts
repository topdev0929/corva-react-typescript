import { showErrorNotification } from '@corva/ui/utils';

export const useDownloadFile = (getLink: (ref: string) => Promise<string>) => {
  return async (ref: string) => {
    try {
      const url = await getLink(ref);
      window.open(url, '_parent');
    } catch (e) {
      showErrorNotification('Download request failed');
    }
  };
};
