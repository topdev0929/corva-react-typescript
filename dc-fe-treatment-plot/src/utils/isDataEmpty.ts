import { isEmpty } from 'lodash';
import { GroupedWitsData } from '@/types/Data';

export const isAppDataEmpty = (data: GroupedWitsData[], isAssetViewer: boolean): boolean => {
  return isEmpty(isAssetViewer ? data || data[0]?.wits : data);
};
