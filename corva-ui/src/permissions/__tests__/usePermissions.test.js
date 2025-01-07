import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { mapValues } from 'lodash';

import * as jsonApi from '~/clients/jsonApi';

import usePermissions from '../usePermissions';
import ProvidePermissions from '../ProvidePermissions';
import { PERMISSIONS } from '../constants';

const { getPermissionCheck } = jsonApi;

jest.mock('~/clients/jsonApi');

const PERMISSION_KEYS = [PERMISSIONS.companySelectorView, PERMISSIONS.userCreate];
const OBJECT_WITH_PERMISSION_VALUES = {
  companySelectorView: PERMISSIONS.companySelectorView,
  userCreate: PERMISSIONS.userCreate,
};

describe('usePermissions', () => {
  const wrapper = ({ children }) => <ProvidePermissions>{children}</ProvidePermissions>;

  it('returns an array of initial responses', async () => {
    const { result } = renderHook(() => usePermissions(PERMISSION_KEYS), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current).toStrictEqual([
        { active: false, loading: true },
        { active: false, loading: true },
      ])
    );
  });

  it('returns an object of initial responses (object)', async () => {
    const { result } = renderHook(() => usePermissions(OBJECT_WITH_PERMISSION_VALUES), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current).toStrictEqual({
        companySelectorView: { active: false, loading: true },
        userCreate: { active: false, loading: true },
      })
    );
  });

  describe('returns actual permission', () => {
    it('returns active: TRUE if user has permission', async () => {
      getPermissionCheck.mockResolvedValue({ active: true });
      const { result, waitForNextUpdate } = renderHook(() => usePermissions(PERMISSION_KEYS), {
        wrapper,
      });
      await waitForNextUpdate();
      expect(result.current).toStrictEqual([
        { active: true, loading: false },
        { active: true, loading: false },
      ]);
    });

    it('returns active: TRUE if user has permission (object)', async () => {
      getPermissionCheck.mockResolvedValue({ active: true });
      const { result, waitForNextUpdate } = renderHook(
        () => usePermissions(OBJECT_WITH_PERMISSION_VALUES),
        {
          wrapper,
        }
      );
      await waitForNextUpdate();
      expect(result.current).toStrictEqual({
        companySelectorView: { active: true, loading: false },
        userCreate: { active: true, loading: false },
      });
    });

    it('returns active: FALSE if user has no permission', async () => {
      getPermissionCheck.mockResolvedValue({ active: false });
      const { result, waitForNextUpdate } = renderHook(() => usePermissions(PERMISSION_KEYS), {
        wrapper,
      });
      await waitForNextUpdate();
      expect(result.current).toStrictEqual([
        { active: false, loading: false },
        { active: false, loading: false },
      ]);
    });

    it('returns active: FALSE if user has no permission (object)', async () => {
      getPermissionCheck.mockResolvedValue({ active: false });
      const { result, waitForNextUpdate } = renderHook(
        () => usePermissions(OBJECT_WITH_PERMISSION_VALUES),
        {
          wrapper,
        }
      );
      await waitForNextUpdate();
      expect(result.current).toStrictEqual({
        companySelectorView: { active: false, loading: false },
        userCreate: { active: false, loading: false },
      });
    });

    it('returns value from cache without additional network requests', async () => {
      jsonApi.getPermissionCheck = jest.fn().mockResolvedValue({ active: true });
      const { rerender } = renderHook(usePermissions, {
        initialProps: [PERMISSIONS.companySelectorView],
        wrapper,
      });

      rerender([PERMISSIONS.userCreate]);
      rerender([PERMISSIONS.companySelectorView]);
      rerender([PERMISSIONS.userCreate, PERMISSIONS.companySelectorView]);

      await waitFor(() => expect(jsonApi.getPermissionCheck).toHaveBeenCalledTimes(2));
    });

    it('returns value from cache without additional network requests (object)', async () => {
      jsonApi.getPermissionCheck = jest.fn().mockResolvedValue({ active: true });
      const { rerender } = renderHook(usePermissions, {
        initialProps: { userCreate: PERMISSIONS.userCreate },
        wrapper,
      });

      rerender({ userCreate: PERMISSIONS.userCreate });
      rerender({ companySelect: PERMISSIONS.companySelectorView });
      rerender({
        userCreate: PERMISSIONS.userCreate,
        companySelect: PERMISSIONS.companySelectorView,
      });

      await waitFor(() => expect(jsonApi.getPermissionCheck).toHaveBeenCalledTimes(2));
    });
  });
});
