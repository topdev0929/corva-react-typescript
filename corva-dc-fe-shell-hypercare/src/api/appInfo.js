import { corvaAPI } from '@corva/ui/clients';

export async function getAppId(queryParams) {
  try {
    const response = await corvaAPI.get(`/v2/apps`, queryParams);
    if (!response.data?.[0]) return null;
    return Number(response.data[0].id);
  } catch (err) {
    return null;
  }
}

export async function getApp(appId, queryParams) {
  try {
    return await corvaAPI.get(`/v2/apps/${appId}`, queryParams, { isImmutable: false });
  } catch (err) {
    return null;
  }
}
