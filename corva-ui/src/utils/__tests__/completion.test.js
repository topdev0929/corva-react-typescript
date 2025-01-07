import { COMPLETION_APP_TYPES, COMPLETION_APPTYPE_MODES_DICT } from '~/constants/completion';
import {
  resolveActiveFracAsset,
  resolveActiveWirelineAsset,
  resolveActivePumpdownAsset,
  getDefaultPadModeSetting,
} from '../completion';

describe('resolveActiveFracAsset', () => {
  it('should return null when no active frac asset is found', () => {
    const assets = [
      {
        app_streams: [
          { source_type: 'wireline', status: 'active', last_active_at: 1640353000 },
          {
            source_type: 'pumpdown',
            status: 'inactive',
            last_active_at: 1640353000,
          },
        ],
      },
      {
        app_streams: [
          {
            source_type: 'wireline',
            status: 'inactive',
            last_active_at: 1640353000,
          },
          { source_type: 'frac', status: 'inactive', last_active_at: 1640353000 },
        ],
      },
    ];

    const result = resolveActiveFracAsset(assets);

    expect(result).toBeNull();
  });

  it('should return the active frac asset with the latest last_active_at', () => {
    const assets = [
      {
        app_streams: [
          { source_type: 'wireline', status: 'active', last_active_at: 1640353000 },
          { source_type: 'frac', status: 'inactive', last_active_at: 1640353000 },
        ],
      },
      {
        app_streams: [
          {
            source_type: 'wireline',
            status: 'inactive',
            last_active_at: 1640353000,
          },
          { source_type: 'frac', status: 'active', last_active_at: 1640353000 },
        ],
      },
      {
        app_streams: [
          {
            source_type: 'wireline',
            status: 'inactive',
            last_active_at: 1640353000,
          },
          { source_type: 'frac', status: 'active', last_active_at: 1640353000 },
        ],
      },
    ];

    const result = resolveActiveFracAsset(assets);

    expect(result).toMatchObject({
      app_streams: [
        { source_type: 'wireline', status: 'inactive', last_active_at: 1640353000 },
        { source_type: 'frac', status: 'active', last_active_at: 1640353000 },
      ],
      last_frac_at: 1640353000,
    });
  });
});

describe('resolveActiveWirelineAsset', () => {
  const assets = [
    {
      id: '1',
      app_streams: [
        { source_type: 'wireline', status: 'active', last_active_at: 1640908800000 },
        { source_type: 'other', status: 'inactive', last_active_at: 1640908801000 },
      ],
    },
    {
      id: '2',
      app_streams: [{ source_type: 'wireline', status: 'inactive', last_active_at: 1640908801000 }],
    },
    {
      id: '3',
      app_streams: [],
    },
  ];

  it('should return the active wireline asset with the latest last_active_at', () => {
    const result = resolveActiveWirelineAsset(assets);

    expect(result.id).toBe('1');
    expect(result.last_wireline_at).toBe(1640908800000);
  });

  it('should return null if no active wireline asset is found', () => {
    const result = resolveActiveWirelineAsset([assets[1], assets[2]]);

    expect(result).toBe(null);
  });

  it('should ignore stream status if ignoreStatus is set to true', () => {
    const result = resolveActiveWirelineAsset(assets, true);

    expect(result.id).toBe('2');
    expect(result.last_wireline_at).toBe(1640908801000);
  });
});

describe('resolveActivePumpdownAsset', () => {
  const assets = [
    {
      id: '1',
      app_streams: [
        { source_type: 'pumpdown', status: 'active', last_active_at: 1640908800000 },
        { source_type: 'other', status: 'inactive', last_active_at: 1640908801000 },
      ],
    },
    {
      id: '2',
      app_streams: [{ source_type: 'pumpdown', status: 'inactive', last_active_at: 1640908801000 }],
    },
    {
      id: '3',
      app_streams: [],
    },
  ];

  it('should return the active pumpdown asset with the latest last_active_at', () => {
    const result = resolveActivePumpdownAsset(assets);

    expect(result.id).toBe('1');
    expect(result.last_pumpdown_at).toBe(1640908800000);
  });

  it('should return null if no active pumpdown asset is found', () => {
    const result = resolveActivePumpdownAsset([assets[1], assets[2]]);

    expect(result).toBe(null);
  });

  it('should ignore stream status if ignoreStatus is set to true', () => {
    const result = resolveActivePumpdownAsset(assets, true);

    expect(result.id).toBe('2');
    expect(result.last_pumpdown_at).toBe(1640908801000);
  });
});

describe('getDefaultPadModeSetting', () => {
  const well = { id: 123 };
  const fracFleet = true;

  test('returns custom mode for single well', () => {
    const expected = { mode: 'custom', selectedAssets: [well.id] };

    const result = getDefaultPadModeSetting(false, well, COMPLETION_APP_TYPES.fracSingleWellApp);

    expect(result).toEqual(expected);
  });

  test('returns pad mode for frac fleet', () => {
    const expected = {
      mode: COMPLETION_APPTYPE_MODES_DICT[COMPLETION_APP_TYPES.fracMultiWellApp][0],
    };

    const result = getDefaultPadModeSetting(fracFleet, null, COMPLETION_APP_TYPES.fracMultiWellApp);

    expect(result).toEqual(expected);
  });

  test('returns pad mode for wireline multi well app', () => {
    const expected = {
      mode: COMPLETION_APPTYPE_MODES_DICT[COMPLETION_APP_TYPES.wirelineMultiWellApp][0],
    };

    const result = getDefaultPadModeSetting(
      fracFleet,
      null,
      COMPLETION_APP_TYPES.wirelineMultiWellApp
    );

    expect(result).toEqual(expected);
  });
});
