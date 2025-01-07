import { renderHook, act } from '@testing-library/react-hooks';
import { useHideAxes } from '../useHideAxes';

describe('useHideAxes', () => {
  it('should toggle isHiddenAxes state when handleAxesHide is called', () => {
    const chartMock = {
      update: jest.fn(),
      marginBottom: 20,
    };
    const onChartStylesChangeMock = jest.fn();
    const { result } = renderHook(() =>
      useHideAxes({ chart: chartMock, onChartStylesChange: onChartStylesChangeMock })
    );

    expect(result.current.isHiddenAxes).toBe(false);

    act(() => {
      result.current.handleAxesHide();
    });

    expect(result.current.isHiddenAxes).toBe(true);

    expect(onChartStylesChangeMock).toHaveBeenCalledWith({ marginBottom: 20 });

    act(() => {
      result.current.handleAxesHide();
    });

    expect(result.current.isHiddenAxes).toBe(false);
    expect(chartMock.update).toHaveBeenCalledWith({
      xAxis: {
        title: {
          enabled: false,
        },
        labels: {
          enabled: false,
        },
      },
      yAxis: {
        title: {
          enabled: false,
        },
        labels: {
          enabled: false,
        },
      },
    });
    expect(onChartStylesChangeMock).toHaveBeenCalledWith({ marginBottom: 20 });
  });
});
