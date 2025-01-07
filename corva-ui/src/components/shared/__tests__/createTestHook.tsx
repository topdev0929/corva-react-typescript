import { render } from '@testing-library/react';

export function createTestHook<T extends (...args: any[]) => any>(hook: T) {
  let result: ReturnType<T> = null;
  let rerender: ReturnType<typeof render>['rerender'];

  const TestComponent = (props: { hookArgs: Parameters<T> }) => {
    result = hook(...props.hookArgs);
    return <div />;
  };

  return (...props: Parameters<T>) => {
    if (rerender) {
      rerender(<TestComponent hookArgs={props} />);
    } else {
      rerender = render(<TestComponent hookArgs={props} />).rerender;
    }

    return result;
  };
}
