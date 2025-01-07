import React from 'react';
import { render } from '@testing-library/react';
import Breadcrumbs from '..';

describe('Breadcrumbs component', () => {
  const pathItems = [
    { text: 'Home', href: '/' },
    { text: 'Category', href: '/category' },
    { text: 'Subcategory', href: '/category/subcategory' },
  ];

  it('renders without crashing', () => {
    const { getByTestId } = render(<Breadcrumbs pathItems={pathItems} />);
    expect(getByTestId('Breadcrumbs_Home')).toBeInTheDocument();
  });

  it('renders all path items', () => {
    const { getByTestId } = render(<Breadcrumbs pathItems={pathItems} />);
    pathItems.forEach(pathItem => {
      expect(getByTestId(`Breadcrumbs_${pathItem.text}`)).toBeInTheDocument();
    });
  });

  it('renders the last path item with the "lastPathPart" class', () => {
    const { getByTestId } = render(<Breadcrumbs pathItems={pathItems} />);
    const lastPathItem = pathItems[pathItems.length - 1];
    const lastPathPart = getByTestId(`Breadcrumbs_${lastPathItem.text}`);
    expect(lastPathPart.getAttribute('class')).toContain('lastPathPart');
  });
});
