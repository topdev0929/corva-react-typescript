import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectItem from '../SelectItem';

describe('SelectItem', () => {
  it('displays active status when status is active', () => {
    const assetName = 'Asset 1';
    render(<SelectItem assetName={assetName} status="active" />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('displays tooltip when text is truncated', () => {
    const assetName = 'This is a long asset name that needs to be truncated';
    render(<SelectItem assetName={assetName} />);

    userEvent.hover(screen.getByText(assetName));

    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('handles checkbox state correctly', () => {
    const assetName = 'Asset 1';
    render(<SelectItem assetName={assetName} multiple selected />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
