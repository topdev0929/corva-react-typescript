// DELETE this file once update SizeMe to v3 or later. It should include own types

declare module 'react-sizeme' {
  interface SizeMeOptions {
    monitorWidth?: boolean;
    monitorHeight?: boolean;
    monitorPosition?: boolean;
    refreshRate?: number;
    refreshMode?: 'throttle' | 'debounce';
    noPlaceholder?: boolean;
    children?: any;
  }

  interface SizeMeProps {
    size: {
      width: number | null;
      height: number | null;
    };
  }

  function withSize(
    options?: SizeMeOptions
  ): <Component extends React.ElementType>(
    Component: Component
  ) => React.ElementType<Omit<React.ComponentProps<Component>, 'size'>>;

  const SizeMe: React.FC<SizeMeOptions>;
}
