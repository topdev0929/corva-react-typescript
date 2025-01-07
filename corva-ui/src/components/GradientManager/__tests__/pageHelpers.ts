import { screen, fireEvent, within } from '@testing-library/react';
import chroma from 'chroma-js';

export const flushPromises = () => {
  return new Promise(jest.requireActual('timers').setImmediate);
};

const eventOptions = { 'view': window, 'bubbles': true, 'cancelable': true };

export const page = {
  openGradientSelect() {
    const select = screen.getByTestId('gradient-select');
    fireEvent.mouseDown(select.firstChild);
  },

  addBtn() {
    return within(screen.getByRole('listbox'))
      .queryByTestId('add-gradient-btn');
  },

  saveBtn() {
    return screen.queryByTestId('save-gradient-btn');
  },
  deleteStopBtn() {
    return screen.queryByTestId('delete-stop-btn');
  },
  deleteBtn() {
    return screen.queryByTestId('delete-gradient-btn');
  },
  editBtn() {
    return screen.queryByTestId('edit-gradient-btn');
  },
  cancelBtn() {
    return screen.queryByTestId('cancel-edit-btn');
  },

  setNameValue(value) {
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value },
    });
  },

  getNameEditValue() {
    return (screen.getByRole('textbox') as HTMLInputElement).value;
  },

  getTextOnSelect() {
    return screen.getByTestId('gradient-select').textContent;
  },

  selectItemNamed(name: string) {
    this.openGradientSelect();
    within(screen.getByRole('listbox'))
      .getByText(name)
      .click();
  },

  getStops() {
    return Array.from(screen.getByTestId('gradient-track').children);
  },
  getStopValues() {
    const getPos = stop => Number(stop.style.transform.match(/\((.*)px,/)[1]);
    const stops = this.getStops();
    const firstStopPos = getPos(stops[0]);

    return stops.map((stopElement: HTMLDivElement) => {
      const { style } = stopElement;
      // built-in gradients contains colors in uppercase, so keep it simple for now
      const color = chroma(style.backgroundColor)
        .hex()
        .toLocaleUpperCase();
      // with mocked width 100px positions will be between 0 and 100
      const pos = Number(style.transform.match(/\((.*)px,/)[1]) - firstStopPos;
      return { color, pos }
    })
  },
  clickStop(stopIndex: number) {
    const stop: HTMLDivElement = this.getStops()[stopIndex];

    fireEvent(stop.firstChild, new MouseEvent('mouseenter', eventOptions));
    fireEvent.click(stop.firstChild);
  },
  clickTrackAt(pos: number) {
    const track = screen.getByTestId('gradient-track');

    let evt: any = new MouseEvent('mouseenter', eventOptions);
    evt.pageX = pos;
    evt.pageY = 10;

    fireEvent(track, evt);

    // firing event twice because Draggable is not fully initialized on the very
    // first event and gives wrong isCursorOutside value
    evt = new MouseEvent('mouseenter', eventOptions);
    evt.pageX = pos;
    evt.pageY = 10;

    fireEvent(track, evt);

    const addCircle = screen.getByTestId('add-circle');
    fireEvent.click(addCircle);
  },

  getSelectOptions(){
    return within(screen.getByRole('listbox'))
      .getAllByRole('option')
      .map(element => element.textContent);
  },
};
