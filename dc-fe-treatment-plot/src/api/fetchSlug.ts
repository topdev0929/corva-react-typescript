import { corvaAPI } from '@corva/ui/clients';

export async function getDashboardSlug(): Promise<string | undefined> {
  const params = {
    type: 'asset_dashboard',
    visibility: 'visible',
  };

  function parseSlug(response: any): string | undefined {
    const wellhubData = response.data.filter(record => record.attributes.name === 'Wellhub');
    if (wellhubData) return wellhubData[0].attributes.slug;

    return undefined;
  }

  try {
    return corvaAPI.get('/v2/dashboards', params).then(parseSlug);
  } catch (e) {
    return undefined;
  }
}
