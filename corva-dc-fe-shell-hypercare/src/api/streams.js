import { getStreams } from '@corva/ui/clients/jsonApi';
import { SEGMENTS } from '@corva/ui/constants/segment';

export const loadColumnMapper = async assetId => {
  try {
    const streams = await getStreams({ assetId, segment: SEGMENTS.DRILLING });
    const stream = streams.find(stream => stream.log_type === 'time') || { app_connections: [] };

    const { mappings } = stream.app_connections.find(app => !!app.settings.mappings).settings || {};
    return mappings;
  } catch (e) {
    return [];
  }
};
