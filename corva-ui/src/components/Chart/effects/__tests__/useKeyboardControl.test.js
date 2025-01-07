import { renderHook } from '@testing-library/react-hooks';
import { useKeyboardControl } from '../useKeyboardControl';

describe('useKeyboardControl', () => {
  let addEventListenerMock;
  let removeEventListenerMock;

  beforeEach(() => {
    addEventListenerMock = jest.spyOn(document, 'addEventListener');
    removeEventListenerMock = jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerMock.mockRestore();
    removeEventListenerMock.mockRestore();
  });

  it('should add event listener on mount', () => {
    const callback = jest.fn();
    renderHook(() => useKeyboardControl({ keyCode: 13, callback }));

    expect(addEventListenerMock).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useKeyboardControl({ keyCode: 13, callback }));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should call the callback when the correct key combination is pressed', () => {
    const callback = jest.fn();
    renderHook(() => useKeyboardControl({ keyCode: 13, callback }));

    const event = new KeyboardEvent('keydown', { keyCode: 13, metaKey: true });
    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it('should not call the callback when a different key combination is pressed', () => {
    const callback = jest.fn();
    renderHook(() => useKeyboardControl({ keyCode: 13, callback }));

    const event = new KeyboardEvent('keydown', { keyCode: 27, metaKey: true });
    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
