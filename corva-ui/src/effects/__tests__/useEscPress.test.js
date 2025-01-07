import { renderHook } from '@testing-library/react-hooks';
import useEscPress from '../useEscPress';

describe('useEscPress', () => {
  let callback;

  beforeEach(() => {
    callback = jest.fn();
  });

  afterEach(() => {
    callback.mockReset();
  });

  it('calls the callback when the Escape key is pressed', () => {
    renderHook(() => useEscPress(callback));
    const event = new KeyboardEvent('keydown', { keyCode: 27 });
    document.dispatchEvent(event);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback when a non-Escape key is pressed', () => {
    renderHook(() => useEscPress(callback));
    const event = new KeyboardEvent('keydown', { keyCode: 13 });
    document.dispatchEvent(event);
    expect(callback).not.toHaveBeenCalled();
  });
});
