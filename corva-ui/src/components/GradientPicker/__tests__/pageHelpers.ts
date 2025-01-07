
import { screen, fireEvent } from '@testing-library/react';
import chroma from 'chroma-js';


const eventOptions = { 'view': window, 'bubbles': true, 'cancelable': true };

export const page = {
  deleteStopBtn() {
    return screen.queryByTestId('GradientPicker_stopDelete');
  },

  getStops() {
    return Array.from(screen.getByTestId('GradientPicker_track').children);
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
    const track = screen.getByTestId('GradientPicker_track');

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

    const addCircle = screen.getByTestId('GradientPicker_addCircle');
    fireEvent.click(addCircle);
  },
};
