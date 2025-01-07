import React from 'react';
import { render } from '@testing-library/react';

import LabelsCounter from '../index';

describe('LabelsCounter component', () => {
  it('renders without crashing', () => {
    render(<LabelsCounter items={[]} />);
  });

  it('renders nothing if there are no items', () => {
    const { container } = render(<LabelsCounter items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a single chip if there is only one item', () => {
    const items = ['Item 1'];
    const { getByText } = render(<LabelsCounter items={items} />);
    expect(getByText(items[0])).toBeInTheDocument();
  });

  it('renders a chip with truncated text for the first item', () => {
    const items = ['This is a very long item that needs to be truncated'];
    const { getByText } = render(<LabelsCounter items={items} />);
    expect(getByText('This is a very long item that needs to be truncated')).toBeInTheDocument();
  });

  it('renders a tooltip if there are multiple items', () => {
    const items = ['Item 1', 'Item 2'];
    const { getByText } = render(<LabelsCounter items={items} />);
    expect(getByText('+1')).toBeInTheDocument();
  });
});
