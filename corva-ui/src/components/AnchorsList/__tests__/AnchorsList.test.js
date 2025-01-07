import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnchorsList from '../AnchorsList';

// Mock makeStyles to return the mock class name
jest.mock('@material-ui/core', () => ({
  ...jest.requireActual('@material-ui/core'),
  makeStyles: () => () => ({
    active: 'active',
  }),
}));

describe('AnchorsList', () => {
  const items = [
    { hash: 'section1', text: 'Section 1' },
    { hash: 'section2', text: 'Section 2' },
    { hash: 'section3', text: 'Section 3' },
  ];

  it('renders without crashing', () => {
    render(<AnchorsList title="Table of Contents" items={items} />);
  });

  it('renders the correct title', () => {
    const { getByText } = render(<AnchorsList title="Table of Contents" items={items} />);
    expect(getByText('Table of Contents')).toBeInTheDocument();
  });

  it('renders an item for each heading', () => {
    const { container } = render(<AnchorsList items={items} />);

    items.forEach(item => {
      const listitem = container.querySelector(`[href="#${item.hash}"]`);
      expect(listitem).toBeInTheDocument();
      expect(listitem.textContent).toBe(item.text);
    });
  });

  it('sets the clicked item as active', () => {
    const { getByTestId } = render(<AnchorsList title="Table of Contents" items={items} />);
    const secondItem = getByTestId(`anchor-item-${items[1].hash}`);
    fireEvent.click(secondItem);
    expect(secondItem).toHaveClass('active');
  });
});
