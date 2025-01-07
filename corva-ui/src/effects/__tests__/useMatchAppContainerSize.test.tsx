import { fireEvent, render } from '@testing-library/react';
import { ISOLATED_PAGE_APP_CONTAINER_ID } from '~/components/DevCenter/IsolatedDevCenterAppContainer/constants';
import {
  MatchAppContainerSizeOptions,
  useMatchAppContainerSize,
} from '../useMatchAppContainerSize';

// Ignore throttling for tests
jest.mock('lodash', () => ({
  throttle: jest.fn(fn => fn),
}));

describe('useMatchAppContainerSize', () => {
  const originalGetBoundingClientRect = window.HTMLElement.prototype.getBoundingClientRect;
  const originalConsoleError = console.error;

  const mockGetBoundingClientRect = ({
    width = 0,
    height = 0,
  }: {
    width?: number;
    height?: number;
  }) => {
    window.HTMLElement.prototype.getBoundingClientRect = () =>
      ({
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        height,
        width,
      } as DOMRect);
  };

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    window.HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    console.error = originalConsoleError;
  });

  const CONTENT_EL_ID = 'app-content';
  const Component = ({ options = {} }: { options?: MatchAppContainerSizeOptions }) => {
    const match = useMatchAppContainerSize(options);

    return (
      <div style={{ width: '1vw', height: '1wh' }} id={ISOLATED_PAGE_APP_CONTAINER_ID}>
        <div style={{ width: 200, height: 300 }} data-testid={CONTENT_EL_ID}>
          {`match: ${match}`}
        </div>
      </div>
    );
  };

  it('should match to true for empty object', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: true');
  });

  it('should call console.error in case if ISOLATED_PAGE_APP_CONTAINER_ID is missing in parent components', () => {
    const NonWrappedComponent = ({ options = {} }: { options?: MatchAppContainerSizeOptions }) => {
      const match = useMatchAppContainerSize(options);

      return (
        <div style={{ width: 200, height: 300 }} data-testid={CONTENT_EL_ID}>
          {`match: ${match}`}
        </div>
      );
    };

    render(<NonWrappedComponent />);
    expect(console.error).toBeCalled();
    expect(console.error).toBeCalledWith(
      `#isolated-page-app-container component is not available. Check if you are not using "useMatchAppContainerSize" hook outside of DC app`
    );
  });

  it('should not call console.error if ISOLATED_PAGE_APP_CONTAINER_ID is present as a parent wrapper', () => {
    render(<Component />);
    expect(console.error).not.toBeCalled();
  });

  it('should match to false for when element bigger than min width value', () => {
    mockGetBoundingClientRect({ width: 1000 });

    const options: MatchAppContainerSizeOptions = { width: { min: 1000 } };
    const { getByTestId } = render(<Component options={options} />);
    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: false');
  });

  it('should respond to window resize', async () => {
    mockGetBoundingClientRect({ width: 1000 });

    const options: MatchAppContainerSizeOptions = { width: { min: 900 } };
    const { getByTestId } = render(<Component options={options} />);

    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: true');

    mockGetBoundingClientRect({ width: 500 });
    fireEvent(window, new Event('resize'));

    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: false');

    mockGetBoundingClientRect({ width: 1200 });
    fireEvent(window, new Event('resize'));

    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: true');
  });

  it('should match correct max width', () => {
    mockGetBoundingClientRect({ width: 950 });

    const options: MatchAppContainerSizeOptions = { width: { max: 1000, min: 900 } };
    let { getByTestId } = render(<Component options={options} />);
    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: true');
  });

  it('should not match incorrect max width', () => {
    mockGetBoundingClientRect({ width: 950 });

    const options: MatchAppContainerSizeOptions = { width: { max: 900, min: 600 } };
    let { getByTestId } = render(<Component options={options} />);
    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: false');
  });

  it('should match height', () => {
    mockGetBoundingClientRect({ height: 950 });

    const options: MatchAppContainerSizeOptions = { height: { max: 1000, min: 900 } };
    const { getByTestId } = render(<Component options={options} />);
    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: true');
  });

  it('should not match incorrect max height', () => {
    mockGetBoundingClientRect({ height: 950 });

    const options: MatchAppContainerSizeOptions = { height: { min: 1000, max: 2000 } };
    const { getByTestId } = render(<Component options={options} />);
    expect(getByTestId(CONTENT_EL_ID).innerHTML).toBe('match: false');
  });
});
