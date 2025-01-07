import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor, render, screen } from '@testing-library/react';

import * as jsonApi from '~/clients/jsonApi';

import { withPermissionsHOC } from '../withPermissionsHOC';
import ProvidePermissions from '../ProvidePermissions';
import { PERMISSIONS } from '../constants';

const { getPermissionCheck } = jsonApi;

jest.mock('~/clients/jsonApi');

const MockComponent = ({ canViewDevCenter }) => (
  <button disabled={!canViewDevCenter}>Dev Center</button>
);
const WithPermissionsComponent = withPermissionsHOC({
  canViewDevCenter: PERMISSIONS.canViewDevCenter,
})(MockComponent);

describe('withPermissionsHOC', () => {
  it('returns FALSE by default', async () => {
    render(<WithPermissionsComponent />, { wrapper: ProvidePermissions });
    await waitFor(async () => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  it('returns TRUE if user has permission', async () => {
    getPermissionCheck.mockResolvedValue({ active: true });
    render(<WithPermissionsComponent />, { wrapper: ProvidePermissions });
    await waitFor(async () => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  it('returns FALSE if user has no permission', async () => {
    getPermissionCheck.mockResolvedValue({ active: false });
    render(<WithPermissionsComponent />, { wrapper: ProvidePermissions });
    await waitFor(async () => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
