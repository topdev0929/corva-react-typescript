import { flattenDepth, range } from 'lodash';
import * as queryString from 'query-string';

import { get, put, del, post, patch, sendFormData, baseUrl, APIException } from '../api/apiCore';

import { CORVA_API_URLS } from '../constants';

export * from './postTaskAndWaitResult';

// Function is used to check if user is logged in. No need to use 'get'
// wrapper here, as it contains error handlers and redirects not needed
// for this purpose
export async function getCurrentUser() {
  const response = await fetch(`${baseUrl}/v1/users/current`, { credentials: 'include' });
  const responseJson = await response.json();

  if (!response?.ok) {
    throw new APIException(response, responseJson);
  }

  return responseJson;
}

export async function getWellViewBha(options = {}) {
  return get('/v2/integration/wellview/bha', options);
}

export async function getWells(options) {
  return get('/v2/wells', options);
}

export async function getWell(id, options = {}) {
  return get(`/v2/wells/${id}`, options);
}

export async function getRig(id, options = {}) {
  return get(`/v2/rigs/${id}`, options);
}

export async function getRigs(options = {}) {
  return get('/v2/rigs', options);
}

export async function getPrograms(options = {}) {
  return get('/v2/programs', options);
}

export async function getAsset(id, options = {}) {
  return get(`/v2/assets/${id}`, options);
}

export async function getAssets(options = {}) {
  return get('/v2/assets', options);
}

export async function getResolvedAssets(options = {}) {
  return post('/v2/assets/resolve', options);
}

export async function getPads(options = {}) {
  return get('/v2/pads', options);
}

export async function getFracFleets(options = {}) {
  return get('/v2/frac_fleets', options);
}

export async function getDrilloutUnit(drilloutUnitId, options = {}) {
  return get(`/v2/drillout_units/${drilloutUnitId}`, options);
}

export async function getDrilloutUnits(options = {}) {
  return get('/v2/drillout_units', options);
}

export async function deleteAppStorageRecords(provider, collection, queryParams) {
  return del(`/v1/data/${provider}/${collection}`, queryParams);
}

export async function deleteAppStorage(provider, collection, id) {
  return del(`/v1/data/${provider}/${collection}/${id}`);
}

export async function getAppStorage(provider, collection, assetId, params = {}) {
  return get(
    `/v1/data/${provider}/${collection}`,
    { ...params, asset_id: assetId },
    { appKey: params.appKey }
  );
}

export async function getDataAppStorage(provider, collection, params = {}) {
  return get(`/api/v1/data/${provider}/${collection}/`, params, {
    apiUrl: CORVA_API_URLS.DATA_API,
  });
}

export async function getDataAppStorageAggregate(provider, collection, params = {}) {
  return get(`/api/v1/data/${provider}/${collection}/aggregate/`, params, {
    apiUrl: CORVA_API_URLS.DATA_API,
  });
}

export async function putAppStorage(provider, collection, id, item, queryParams = {}) {
  return put(`/v1/data/${provider}/${collection}/${id}`, item, queryParams);
}

export async function putDataAppStorage(provider, collection, id, item, queryParams) {
  return put(`/api/v1/data/${provider}/${collection}/${id}`, item, queryParams, {
    apiUrl: CORVA_API_URLS.DATA_API,
  });
}

export async function postAppStorage(provider, collection, item) {
  return post(`/v1/data/${provider}/${collection}`, item);
}

export async function postDataAppStorage(provider, collection, item) {
  return post(`/api/v1/data/${provider}/${collection}`, item, {
    apiUrl: CORVA_API_URLS.DATA_API,
  });
}

export async function getCompetitorAnalysisData(options) {
  return get('/v1/competitor_analysis', options);
}

export async function getCompanies() {
  return get('/v1/companies');
}

export async function getPicklist(name) {
  return get(`/v2/picklists/${name}`);
}

export async function getFavorites() {
  return get(`/v2/favorites`);
}

export async function getCompanyGoals(companyId) {
  return get(`/v1/companies/${companyId}/settings/company_goals`);
}

export const getLASFileList = async assetId => {
  const $match = {
    asset_id: +assetId,
  };

  const $group = {
    _id: '$file',
    name: { $first: '$file' },
    timestamp: { $first: '$timestamp' },
  };

  const $sort = {
    timestamp: -1,
  };

  const queryJson = {
    aggregate: JSON.stringify([{ $match }, { $group }, { $sort }]),
  };

  try {
    return await getAppStorage('corva', 'formation-evaluation.metadata', assetId, queryJson);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getLASMetadata = async (assetId, fileName) => {
  const query = `{asset_id#eq#${assetId}}AND{file#eq#'${fileName}'}`;
  try {
    return await getAppStorage('corva', 'formation-evaluation.metadata', assetId, { query });
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getLASFileDataByPage = async (assetId, fileName, pageNumber) => {
  const $match = { asset_id: +assetId, 'metadata.file': fileName };
  const $limit = 10000;
  const $skip = pageNumber * 10000;
  const $sort = { 'data.md': 1 };
  const $project = {
    data: '$data',
  };

  const queryJson = {
    aggregate: JSON.stringify([{ $match }, { $sort }, { $skip }, { $limit }, { $project }]),
  };

  try {
    const response = await getAppStorage('corva', 'formation-evaluation.data', assetId, queryJson);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAllLASFileData = async ({ assetId, fileName, recordsCount }) => {
  const pagesCount = Math.ceil(recordsCount / 10000);
  const promises = range(pagesCount).map(page => getLASFileDataByPage(assetId, fileName, page));

  return Promise.all(promises).then(responses => flattenDepth(responses));
};

export const getStreams = ({ assetId, segment = 'drilling' }) => {
  return get(`/v1/app_streams?asset_id=${assetId}&segment=${segment}`);
};

/** higher order function that returns request function based on provided assetType
 * @param {string} assetType - any asset type currently supported in
 * ~/constants/assets
 * */
export function mapAssetGetRequest(assetType) {
  switch (assetType) {
    case 'program':
      return getPrograms;
    case 'rig':
      return getRigs;
    case 'well':
      return getWells;
    case 'frac_fleet':
      return getFracFleets;
    case 'drillout_unit':
      return getDrilloutUnits;
    case 'pad':
      return getPads;
    default:
      return getAssets;
  }
}

export function mapAssetByIdGetRequest(assetType) {
  switch (assetType) {
    case 'rig':
      return getRig;
    case 'well':
      return getWell;
    default:
      return getAsset;
  }
}

export const getAppMedia = (appId, queryParams) => {
  return get(`/v2/apps/${appId}/app_media`, queryParams);
};

export const deleteAppMedia = (appId, mediaId) => {
  return del(`/v2/apps/${appId}/app_media/${mediaId}`, null);
};

export const uploadAppMedia = (appId, { file, mediaType }) => {
  return sendFormData(`/v2/apps/${appId}/app_media`, {
    'app_media[media_type]': mediaType,
    'app_media[file]': file,
  });
};

export const updateAppMedia = (appId, mediaId, mediaFields) => {
  return patch(`/v2/apps/${appId}/app_media/${mediaId}`, { app_media: mediaFields });
};

export const getAppHelpContent = (appId, queryParams) => {
  return get(`/v2/apps/${appId}/app_help_contents`, queryParams);
};

export const deleteAppHelpContent = (appId, helpContentId) => {
  return del(`/v2/apps/${appId}/app_help_contents/${helpContentId}`, null);
};

export const uploadAppHelpContent = (appId, { title, description, url }) => {
  return sendFormData(`/v2/apps/${appId}/app_help_contents`, {
    'app_help_content[title]': title,
    'app_help_content[description]': description,
    'app_help_content[url]': url,
  });
};

export const updateAppHelpContent = (
  appId,
  helpContentId,
  { title, description, url, position }
) => {
  return patch(`/v2/apps/${appId}/app_help_contents/${helpContentId}`, {
    app_help_content: { title, description, url, position },
  });
};

export async function postAnnotation(annotation, options = {}) {
  return post('/v2/dashboard_app_annotations', {
    app_annotation: annotation,
    ...options,
  });
}

export async function patchAnnotation(annotationId, annotation) {
  return patch(`/v2/dashboard_app_annotations/${annotationId}`, {
    app_annotation: annotation,
  });
}

export async function deleteAnnotation(annotationId) {
  return del(`/v2/dashboard_app_annotations/${annotationId}`);
}

export async function getAnnotations(dashboardAppId, assetId, options = {}) {
  return get(`/v2/dashboard_app_annotations`, {
    app_id: dashboardAppId,
    asset_id: assetId,
    ...options,
  });
}

export async function getDashboardLastAnnotations(dashboardId, assetId, parentAssetId) {
  const params = { dashboard_id: dashboardId };
  if (assetId) params.asset_id = assetId;
  if (parentAssetId) params.parent_asset_id = parentAssetId;

  return get('/v2/dashboard_app_annotations/last_annotations', params);
}

export async function closeLastAnnotation(annotationId) {
  return patch(`/v2/dashboard_app_annotations/${annotationId}/close`);
}

export async function postAnnotationComment(annotationId, comment) {
  return post(`/v2/dashboard_app_annotations/${annotationId}/comments/`, comment);
}

export async function getAnnotationComments(annotationId, options = {}) {
  return get(`/v2/dashboard_app_annotations/${annotationId}/comments/`, options);
}

export function getFileDownloadLink(filename) {
  return `${baseUrl}/v1/file/download?file_name=${filename}`;
}

export async function patchFeedItemComment(feedItemId, commentId, comment) {
  return patch(`/v1/activities/${feedItemId}/comments/${commentId}`, comment);
}

export async function postFeedItemComment(feedItemId, comment) {
  return post(`/v1/activities/${feedItemId}/comments`, comment);
}

export async function deleteFeedItemComment(feedItemId, commentId) {
  return del(`/v1/activities/${feedItemId}/comments/${commentId}`);
}

export async function toggleFeedItemLike(feedItemId) {
  return post(`/v1/activities/${feedItemId}/likes/toggle`);
}

export async function patchFeedItem(feedItemId, feedItem) {
  return patch(`/v1/activities/${feedItemId}`, feedItem);
}

export async function deleteFeedItem(feedItemId) {
  return del(`/v1/activities/${feedItemId}`);
}

export async function getUserAutocomplete(type, value, companyId) {
  const queryParams = { type };

  if (value) {
    queryParams.search = value;
  }
  if (companyId) {
    queryParams.company_id = companyId;
  }

  return get('/v1/users/autocomplete', queryParams);
}

export async function getS3SignedUrl(filename, contentType) {
  return get(`/v1/file/sign?file_name=${encodeURIComponent(filename)}&contentType=${contentType}`);
}

export async function getS3DownloadLink(filename, contentDisposition = 'attachment') {
  return get(
    `/v1/file/download_link?file_name=${encodeURIComponent(filename)}&response_content_disposition=${contentDisposition}`, // prettier-ignore
    {}
  );
}

export const getAppPackages = (appId, queryParams) => {
  return get(`/v2/apps/${appId}/packages`, queryParams);
};

export async function getUserAuthSchemas(email) {
  return get('/v1/sessions/schemas', { email, with_provider: true });
}

export async function getFracFleetWells(options) {
  return get('/v2/frac_fleets/wells', options);
}

export async function getPadWells(padId, options) {
  return get(`/v2/pads/${padId}/app_wells`, options);
}

export async function getTask(taskId) {
  return get(`/v2/tasks/${taskId}`, {});
}

export async function postTask(options = {}) {
  return post('/v2/tasks', options);
}

export const getAppSettingsTemplates = appKey => {
  return get(`/v2/apps/${appKey}/app_settings_templates`, {});
};

export const getAppSettingsTemplate = (appKey, id) => {
  return get(`/v2/apps/${appKey}/app_settings_templates/${id}`, {});
};

export const patchAppSettingsTemplate = (appKey, id, { name, settings }) => {
  return patch(
    `/v2/apps/${appKey}/app_settings_templates/${id}`,
    {
      app_settings_template: {
        name,
        settings,
      },
    },
    {}
  );
};

export const postAppSettingsTemplate = (appKey, { name, settings }) => {
  return post(`/v2/apps/${appKey}/app_settings_templates`, {
    app_settings_template: {
      name,
      settings,
    },
  });
};

export const deleteAppSettingsTemplate = (appKey, id) => {
  return del(`/v2/apps/${appKey}/app_settings_templates/${id}`, {});
};

export const shareAppSettingsTemplate = (appKey, id, userIds) => {
  const query = queryString.stringify({ user_id: userIds }, { arrayFormat: 'bracket' });
  return post(`/v2/apps/${appKey}/app_settings_templates/${id}/share?${query}`, {});
};

export const getUsers = options => {
  const { page, perPage = 1000, sort, order, search, companyId, ids } = options;
  const queryParams = {
    page,
    per_page: perPage,
    sort,
    order,
    ids,
    search: search !== '' ? search : undefined,
    // NOTE: For Corva admins if there is no 'company_id', it returns all companies users
    company_id: companyId !== null ? companyId : undefined,
  };
  return get('/v1/users', queryParams);
};

export async function setCurrentUserSettings(userId, userSettings) {
  return post(`/v1/users/${userId}/settings`, userSettings);
}

export async function getUserSetting(userId, settingKey) {
  return get(`/v1/users/${userId}/settings/${settingKey}`);
}

export async function logout() {
  return post('/v1/logout');
}

export async function getPermissionCheck(options = {}) {
  return get(`/v2/ability_check/check_permission`, options, { isImmutable: false });
}

export async function getDashboards(params = {}) {
  return get('/v2/dashboards', params);
}
