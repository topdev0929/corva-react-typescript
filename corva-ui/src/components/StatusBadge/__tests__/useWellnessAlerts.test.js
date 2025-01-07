import { renderHook } from '@testing-library/react-hooks';
import { useWellnessAlerts } from '~/effects/useWellnessAlerts';

jest.mock('../api', () => ({
  getWCURuleMapping: jest.fn().mockReturnValue([{ rule_id: 'rule_id' }]),
  getWellnessRuleSettings: jest.fn()
    .mockReturnValueOnce([])
    .mockReturnValueOnce([
      { data: { name: 'rule 1' } },
      { data: { name: 'rule 2' } },
    ])
    .mockReturnValueOnce([{ data: { name: 'rule 1' } }]),
  getWellnessAlerts: jest.fn()
    .mockReturnValueOnce([])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([{
      "asset_id": 1,
      "data": {
        "name": "Check Torque and Drag",
        "segment": "drilling",
        "rule_id": "62a33f633da1b0414656e062",
        "category": "T&D",
        "state": "Fatal",
        "message": "99 slack off points are out of range.",
        "status": "open",
        "status_updated_at": 1679851441,
        "note": "",
        "last_checked_at": 1680090721,
        "is_throttled": false,
        "deducts_from_score": 4,
      },
    }]),
}));
jest.mock('~/utils/env', () => ({ isDevOrQAEnv: true }));
jest.mock('~/utils/resolveWellHubSlug', () => jest.fn().mockReturnValue('wellhub-111'));
jest.mock('uuid', () => ({
  v4: jest.fn()
    .mockReturnValueOnce('1111')
    .mockReturnValueOnce('2222')
}));

describe('useWellnessAlerts', () => {
  const props = {
    multiRigAssets: [{ id: 1, name: 'asset 1' }],
    appId: 174,
    dashboards: [{ name: 'Wellhub', icon: 'settings', slug: 'wellhub-111' }],
  };

  it('should render useWellnessAlerts hook with the default state', () => {
    const { result } = renderHook(() => useWellnessAlerts({}));
    expect(result.current).toEqual({ wellnessAlerts: {}, statusBadgeIconType: '' });
  });

  it('should call return default data if there is no rule settings', async () => {
    const { result } = renderHook(() => useWellnessAlerts(props));
    expect(result.current).toEqual({ wellnessAlerts: {}, statusBadgeIconType: '' });
  });

  it('should update the wellnessAlerts and statusBadgeIconType state in case there are no alerts', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWellnessAlerts(props));
    await waitForNextUpdate();
    expect(result.current).toEqual({
      wellnessAlerts: {
        alertsData: {
          'asset 1': [
            {
              alert: {
                assetId: 1,
                status: 'resolved',
                emptyMessage: 'Data quality check passed'
              },
              id: '1111',
              isResolved: true,
              name: 'rule 1',
              linkToDQPage: '/assets/1/wellhub-111/Data Quality'
          },
          {
            alert: {
              assetId: 1,
              status: 'resolved',
              emptyMessage: 'Data quality check passed'
            },
            id: '2222',
            isResolved: true,
            name: 'rule 2',
            linkToDQPage: '/assets/1/wellhub-111/Data Quality'
          }
          ]
        }
      },
      statusBadgeIconType: 'success',
    })
  });

  it('should update the wellnessAlerts and statusBadgeIconType state', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWellnessAlerts(props));
    await waitForNextUpdate();
    expect(result.current).toMatchObject({
      wellnessAlerts: {
        alertsData: {
          'asset 1': [
            {
              alert: {
                assetId: 1,
                status: 'resolved',
              },
              isResolved: true,
              linkToDQPage: '/assets/1/wellhub-111/Data Quality',
              name: 'rule 1',
            },
          ]
        }
      },
      statusBadgeIconType: 'success',
    })
  });
});
