import { renderHook } from '@testing-library/react-hooks';
import useOutsideClick from '../useOutsideClick';

describe('useOutsideClick', () => {
  let callback, ref;

  beforeEach(() => {
    callback = jest.fn();
    ref = { current: document.createElement('div') };
  });

  afterEach(() => {
    callback.mockReset();
  });

  it('calls the callback when a click occurs outside the ref', () => {
    renderHook(() => useOutsideClick(ref, callback));
    const event = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback when a click occurs inside the ref', () => {
    renderHook(() => useOutsideClick(ref, callback));
    const event = new MouseEvent('mousedown', { bubbles: true });
    ref.current.dispatchEvent(event);
    expect(callback).not.toHaveBeenCalled();
  });

  it('does not call the callback when a click occurs inside a material popover/popup', () => {
    renderHook(() => useOutsideClick(ref, callback));
    const popover = document.createElement('div');
    popover.classList.add('MuiPopover-root');
    document.body.appendChild(popover);
    const event = new MouseEvent('mousedown', { bubbles: true });
    popover.dispatchEvent(event);
    expect(callback).not.toHaveBeenCalled();
    document.body.removeChild(popover);
  });

  it('does not call the callback when a click occurs inside a material dialog', () => {
    renderHook(() => useOutsideClick(ref, callback));
    const dialog = document.createElement('div');
    dialog.classList.add('MuiDialog-container');
    document.body.appendChild(dialog);
    const event = new MouseEvent('mousedown', { bubbles: true });
    dialog.dispatchEvent(event);
    expect(callback).not.toHaveBeenCalled();
    document.body.removeChild(dialog);
  });

  it('does not call the callback when a click occurs inside a react modal', () => {
    renderHook(() => useOutsideClick(ref, callback));
    const modal = document.createElement('div');
    modal.classList.add('ReactModalPortal');
    document.body.appendChild(modal);
    const event = new MouseEvent('mousedown', { bubbles: true });
    modal.dispatchEvent(event);
    expect(callback).not.toHaveBeenCalled();
    document.body.removeChild(modal);
  });
});
