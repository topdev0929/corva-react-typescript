import { render, fireEvent, waitFor, getByRole } from '@testing-library/react';
import SingleAssetEditor, { PAGE_NAME } from '../SingleAssetEditor';

jest.mock('~/clients', () => ({
  jsonApi: {
    mapAssetGetRequest: jest.fn().mockReturnValue(() => ({
      data: [
        { id: '1', attributes: { name: 'Asset 1' } },
        { id: '2', attributes: { name: 'Asset 2' } },
      ]
    })),
  }
}));

describe('SingleAssetEditor', () => {
  const onChangeMock = jest.fn();

  const defaultProps = {
    classes: {},
    assetType: 'well',
    defaultValue: 1,
    onChange: onChangeMock,
  };

  it('should render with default props', () => {
    const { getByTestId } = render(<SingleAssetEditor {...defaultProps} />);
    expect(getByTestId(`${PAGE_NAME}_autoComplete`)).toBeInTheDocument();
  });

  it('should render the correct label prop', () => {
    const { getByText } = render(<SingleAssetEditor {...defaultProps} label="Choose An Item" />);
    expect(getByText('Choose An Item')).toBeInTheDocument();
  });

  it('should render "No active asset" when isNullable prop is true', () => {
    const { getByText } = render(<SingleAssetEditor {...defaultProps} isNullable />);
    expect(getByText('No active asset')).toBeInTheDocument();
  });

  it('should render asset options', async () => {
    const { getByRole, getByTestId } = render(<SingleAssetEditor {...defaultProps} currentValue={'2'} />);
    await waitFor(() => {
      fireEvent.mouseDown(getByRole('button'));
      expect(getByTestId(`${PAGE_NAME}_option_Asset 1MenuItem`)).toBeInTheDocument();
    });
  });

  it('should call the onChange callback when an asset is selected', async () => {
    const { getByTestId, getByRole } = render(<SingleAssetEditor {...defaultProps} currentValue={1} />);
    await waitFor(() => {
      fireEvent.mouseDown(getByRole('button'));
      fireEvent.click(getByTestId(`${PAGE_NAME}_option_Asset 2MenuItem`));
      expect(onChangeMock).toHaveBeenCalledWith(2);
    });
  });

  it('should render a CircularProgress component when loading is true', () => {
    const { getByTestId } = render(<SingleAssetEditor {...defaultProps} />);
    expect(getByTestId(`${PAGE_NAME}_CircularProgress`)).toBeInTheDocument();
  });
});
