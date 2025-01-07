import { render } from '@testing-library/react';

import { CardGroup } from '@/components/common/CardGroup';

describe('CardGroup component', () => {
  test('renders title and children', () => {
    const title = 'Test Title';
    const children = <div>Test Children</div>;

    const { getByText } = render(<CardGroup title={title}>{children}</CardGroup>);

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText('Test Children')).toBeInTheDocument();
  });

  test('applies custom padding when provided', () => {
    const title = 'Test Title';
    const children = <div>Test Children</div>;
    const customPadding = '20px';

    const { container } = render(
      <CardGroup title={title} padding={customPadding}>
        {children}
      </CardGroup>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle(`padding: ${customPadding}`);
  });
});
