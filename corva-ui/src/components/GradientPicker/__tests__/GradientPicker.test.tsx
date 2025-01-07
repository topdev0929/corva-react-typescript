import { GradientPicker } from './../GradientPicker';
import { render, waitFor } from '@testing-library/react';
import { getRangeStep, getStopText, reasonableRealValue } from '../GradientPicker.utils';
import { gradients } from './testData';
import { page } from './pageHelpers';

describe('GradientPicker', () => {

  beforeAll(() => {
    // reactSizeMe, ReactCursorPosition and probably Draggable not able to work without layout
    // faking size to have gradient bar 100px wide
    const width = 100;
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(width);
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width,
      height: width,
      top: 0, left: 0, bottom: width, right: width, x: 0, y: 0 } as any);
    jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width);

  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('getStopText', () => {
    it('Should have NO fraction part on range 0-100', () => {
      expect(getStopText(15.1, { fromValue: 0, toValue: 100 })).toEqual('15');
    });
    it('Should be a multiple of 0.5 on range 0-50', () => {
      expect(getStopText(13, { fromValue: 0, toValue: 50 })).toEqual('6.5');
    });

    it('Should be a multiple of 0.2 on range 0-49', () => {
      expect(getStopText(10, { fromValue: 0, toValue: 49 })).toEqual('5.0');
    });

    it('Should be a multiple of 0.1 on range 0-10', () => {
      expect(getStopText(11, { fromValue: 0, toValue: 10 })).toEqual('1.1');
    });

    it('Should be a multiple of 0.02 on range 0-4', () => {
      expect(getStopText(1, { fromValue: 0, toValue: 4 })).toEqual('0.04');
    });

    it('Should be a multiple of 0.001 on range 0-0.1', () => {
      expect(getStopText(55, { fromValue: 0, toValue: 0.1 })).toEqual('0.055');
    });

    it('Should round 876 to 880 on range 0-2000', () => {
      expect(getStopText(876 / 2000 * 100, { fromValue: 0, toValue: 2000 })).toEqual('880');
    });

    it('Should round 1234 to 1230 on range 0-2000 and add a comma', () => {
      expect(getStopText(1234 / 2000 * 100, { fromValue: 0, toValue: 2000 })).toEqual('1,230');
    });

    it('should handle negative values and return -50 for 50 on range -100 to 0', () => {
      expect(getStopText(50, { fromValue: -100, toValue: 0 })).toEqual('-50');
    });

    it('should not crash when fromValue and toValue are both zero', () => {
      expect(getStopText(50, { fromValue: 0, toValue: 0 })).toEqual('0');
    });

    it('should return fromValue when fromValue and toValue are equal', () => {
      expect(getStopText(50, { fromValue: 50, toValue: 50 })).toEqual('50');
    });
  });

  describe('getRangeStep', () => {
    it('should return 1 for 100', () => {
      expect(getRangeStep(100)).toEqual(1);
    });

    it('should return 0.1 for 10', () => {
      expect(getRangeStep(10)).toEqual(0.1);
    });

    it('should return 10 for 1000', () => {
      expect(getRangeStep(1000)).toEqual(10);
    });

    it('should return 2 for 300', () => {
      expect(getRangeStep(300)).toEqual(2);
    });

    it('should return 5 for 500', () => {
      expect(getRangeStep(500)).toEqual(5);
    });

    it('should return 0.2 for 49', () => {
      expect(getRangeStep(49)).toEqual(0.2);
    });
  });

  describe('Component', () => {
    it('should display gradient stops', async () => {
      const handleGradientChange = jest.fn();
      render(<GradientPicker
        from={0}
        to={100}
        unit={null}
        noScale
        gradientStops={gradients.fire.gradientStops}
        onChange={handleGradientChange}
      />);

      await waitFor(() => expect(page.getStopValues()).toHaveLength(3), { timeout: 1000 });

      expect(page.getStopValues()).toEqual([
        { pos: 0, color: '#FFFF00'},
        { pos: 50, color: '#FF8000'},
        { pos: 100, color: '#FF0000'},
      ]);
    });

    it('should be possible to remove a stop', async () => {
      const handleGradientChange = jest.fn();
      render(<GradientPicker
        from={0}
        to={100}
        unit={null}
        noScale
        gradientStops={gradients.fire.gradientStops}
        onChange={handleGradientChange}
      />);

      await waitFor(() => expect(page.getStopValues()).toHaveLength(3), { timeout: 1000 });

      jest.runAllTimers();

      page.clickStop(1);

      page.deleteStopBtn().click();

      expect(handleGradientChange).toBeCalledWith([
        expect.objectContaining({ color: '#FFFF00', pos: 0 }),
        expect.objectContaining({ color: '#FF0000', pos: 100 }),
      ]);
    });
  });

  it('should be possible to add a stop', async () => {
    const handleGradientChange = jest.fn();
    render(<GradientPicker
      from={0}
      to={100}
      unit={null}
      noScale
      gradientStops={gradients.fire.gradientStops}
      onChange={handleGradientChange}
    />);

    await waitFor(() => expect(page.getStopValues()).toHaveLength(3), { timeout: 1000 });

    page.clickTrackAt(30);

    expect(handleGradientChange).toBeCalledWith([
      expect.objectContaining({ color: '#FFFF00', pos: 0 }),
      expect.objectContaining({ color: '#ffb300', pos: 30 }),
      expect.objectContaining({ color: '#FF8000', pos: 50 }),
      expect.objectContaining({ color: '#FF0000', pos: 100 }),
    ]);
  });
});

describe('reasonableRealValue', () => {
  it('should convert 28.499999999999996 to 28.5', () => {
    expect(reasonableRealValue(28.499999999999996)).toEqual(28.5);
  })
  it('should convert 0.1 + 0.2 to 0.3', () => {
    expect(reasonableRealValue(0.1 + 0.2)).toEqual(0.3);
  })
});

