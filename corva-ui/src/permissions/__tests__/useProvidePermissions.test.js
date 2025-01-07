import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

import * as jsonApi from '~/clients/jsonApi';

import { PERMISSIONS } from '../constants';
import useProvidePermissions from '../useProvidePermissions';

const { getPermissionCheck } = jsonApi;

jest.mock('~/clients/jsonApi');

const PERMISSION_KEYS = [PERMISSIONS.companySelectorView, PERMISSIONS.userCreate];

describe('useProvidePermissions', () => {
  it('returns empty permissions object on first call', () => {
    const { result } = renderHook(useProvidePermissions);
    expect(result.current.permissions).toStrictEqual({});
  });

  describe('returns actual permission', () => {
    it('returns active: TRUE if user has permission', async () => {
      const { result } = renderHook(useProvidePermissions);
      getPermissionCheck.mockResolvedValue({ active: true });
      await act(() => result.current.fetchPermissions(PERMISSION_KEYS));
      expect(result.current.permissions).toStrictEqual(
        PERMISSION_KEYS.reduce(
          (acc, permissionKey) => ({ ...acc, [permissionKey]: { loading: false, active: true } }),
          {}
        )
      );
    });

    it('returns active: FALSE if user has no permission', async () => {
      const { result } = renderHook(useProvidePermissions);
      getPermissionCheck.mockResolvedValue({ active: false });
      await act(() => result.current.fetchPermissions(PERMISSION_KEYS));
      expect(result.current.permissions).toStrictEqual(
        PERMISSION_KEYS.reduce(
          (acc, permissionKey) => ({
            ...acc,
            [permissionKey]: { loading: false, active: false },
          }),
          {}
        )
      );
    });

    // NOTE: this test case puts the error log into console and can be enabled for full check while developing
    xit('returns active: FALSE if request failed', async () => {
      const { result } = renderHook(useProvidePermissions);
      getPermissionCheck.mockRejectedValue(new Error('Simulated network error - just ignore it'));
      await act(() => result.current.fetchPermissions([PERMISSIONS.companySelectorView]));
      expect(result.current.permissions).toStrictEqual({
        [PERMISSIONS.companySelectorView]: { loading: false, active: false },
      });
    });

    it('fetches permision only once', async () => {
      const { result } = renderHook(useProvidePermissions);
      jsonApi.getPermissionCheck = jest.fn().mockResolvedValue();

      await act(() => result.current.fetchPermissions([PERMISSIONS.companySelectorView]));
      await act(() => result.current.fetchPermissions([PERMISSIONS.companySelectorView]));
      expect(jsonApi.getPermissionCheck).toHaveBeenCalledTimes(1);
    });
  });
});
