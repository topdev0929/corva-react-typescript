import { baseUrl } from './api/apiCore';

export const CORVA_API_URLS = {
  API: baseUrl,
  DATA_API: baseUrl.replace('api', 'data'),
};