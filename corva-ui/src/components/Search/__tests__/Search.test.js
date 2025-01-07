import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchComponent from '../Search';

const mockOptions = [
  {
    label: 'test1',
    id: 'test1',
  },
  {
    label: 'test2',
    id: 'test2',
  },
  {
    label: 'test3',
    id: 'test3',
  },
  {
    label: 'test4',
    id: 'test4',
  },
  {
    label: 'test5',
    id: 'test5',
  },
];

export const Search = ({ loading, ...props }) => {
  return (
    <SearchComponent
      loading={loading}
      options={mockOptions}
      onChange={() => {}}
      InputProps={{
        startAdornment: <div>startAdornment</div>,
      }}
      value={[]}
      {...props}
    />
  );
};

describe('Search', () => {
  it('should render component', () => {
    render(<Search />);

    expect(screen.getAllByText('startAdornment')).toHaveLength(1);
    expect(document.getElementsByClassName('MuiAutocomplete-root')).toHaveLength(1);
    expect(document.getElementsByTagName('input')).toHaveLength(1);
  });

  it('should be expanded after input change', () => {
    render(<Search />);

    const input = document.getElementsByTagName('input')[0];

    fireEvent.change(input, { target: { value: 'test' } });

    const root = document.getElementsByClassName('MuiAutocomplete-root')[0];
    expect(root.getAttribute('aria-expanded')).toEqual('true');
  });

  it('should render no options', () => {
    render(<Search />);

    const input = document.getElementsByTagName('input')[0];

    fireEvent.change(input, { target: { value: 'text for search' } });

    expect(screen.getByText('No Options')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<Search loading />);

    const input = document.getElementsByTagName('input')[0];

    fireEvent.change(input, { target: { value: 'test loading' } });

    expect(document.getElementsByClassName('MuiCircularProgress-circle')).toHaveLength(1);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('should render searched option', () => {
    render(<Search />);

    const input = document.getElementsByTagName('input')[0];
    const searchValue = mockOptions[0].label;

    fireEvent.change(input, { target: { value: searchValue } });

    const options = document.getElementsByClassName('MuiAutocomplete-option');

    expect(options.length).toEqual(
      mockOptions.filter(({ label }) => label.includes(searchValue)).length
    );
  });

  it('should handle close action on click outside', () => {
    const handleClose = jest.fn();

    const Wrapper = () => (
      <div>
        <span id="target-outside" />
        <Search onClose={handleClose} />
      </div>
    );

    render(<Wrapper />);

    const input = document.getElementsByTagName('input')[0];
    userEvent.click(input);
    userEvent.click(document.getElementById('target-outside'));

    expect(handleClose).toHaveBeenCalled();
  });

  it('should handle close action on escape key', () => {
    const handleClose = jest.fn();
    render(<Search onClose={handleClose} />);

    const input = document.getElementsByTagName('input')[0];
    userEvent.click(input);
    userEvent.type(input, '{esc}');

    expect(handleClose).toHaveBeenCalled();
  });

  it('should open on option click', () => {
    const mockValue = { label: 'value' };
    render(<Search value={[mockValue]} multiple />);

    userEvent.click(document.getElementById('selectedOptions'));
    const options = document.getElementsByClassName('MuiAutocomplete-option');

    expect(options.length).toBeGreaterThan(0);
  });

  it('should close on option click', () => {
    const mockValue = { label: 'value' };
    render(<Search value={[mockValue]} multiple />);

    const input = document.getElementsByTagName('input')[0];
    const selectedOptionsLabel = document.getElementById('selectedOptions');

    userEvent.click(input);
    userEvent.click(selectedOptionsLabel);

    const options = document.getElementsByClassName('MuiAutocomplete-option');

    expect(options.length).toBe(0);
  });
});
