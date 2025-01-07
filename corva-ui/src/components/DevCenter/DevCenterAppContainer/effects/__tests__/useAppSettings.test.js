import { renderHook, act } from '@testing-library/react-hooks';
import { useAppSettings } from '~/components/DevCenter/DevCenterAppContainer/effects';

describe('useAppSettings', () => {
  it('should return a default state and a function to toggle', () => {
    const { result } = renderHook(() =>
      useAppSettings({ setIsFullscreenModalMode: jest.fn() })
    );

    expect(result.current).toEqual({
      isAppSettingsDialogOpened: false,
      toggleAppSettingsDialog: expect.any(Function),
    });
  });

  it('should toggle the state', async () => {
    const { result } = renderHook(() =>
      useAppSettings({ setIsFullscreenModalMode: jest.fn() })
    );

    await act(async () => {
      await result.current.toggleAppSettingsDialog();
    });

    expect(result.current.isAppSettingsDialogOpened).toBe(true);
  });
});
