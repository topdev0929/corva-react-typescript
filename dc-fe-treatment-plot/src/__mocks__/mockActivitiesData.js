import { mockTestAssetId } from './mockAppProps';

export const mockActivitesData = [
  {
    asset_id: mockTestAssetId,
    stage_number: 25,
    activities: [
      {
        activity: 'Pressure Testing',
        start: 1684161840,
        end: 1684162403,
        duration: 563,
      },
      {
        activity: 'Pad',
        start: 1684162404,
        end: 1684163403,
        duration: 999,
      },
      {
        activity: 'Fracturing',
        start: 1684163404,
        end: 1684172983,
        duration: 9579,
      },
      {
        activity: 'Flush',
        start: 1684172984,
        end: 1684173342,
        duration: 358,
      },
      {
        activity: 'Pump Off',
        start: 1684173343,
        end: 1684174474,
        duration: 1131,
      },
    ],
  },
];
