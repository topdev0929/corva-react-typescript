import { render, fireEvent, screen } from '@testing-library/react';
import { AppVersionsSelectView } from '../AppVersionsSelect';

describe('AppVersionsSelectView component', () => {
  const mockOnChange = jest.fn();

  const mockPackages = [
    {
      version: '1.0.0',
      package_code_version: '1.0.0',
      notes: 'test note',
      label: 'PROD',
      status: 'published',
    },
    {
      version: '1.1.0',
      package_code_version: '1.1.0',
      notes: '',
      label: '',
      status: 'published',
    },
  ];

  it('should render the component without error', () => {
    render(<AppVersionsSelectView value="1.0.0" onChange={mockOnChange} />);
  });

  it('should render the component with labeled version', () => {
    render(<AppVersionsSelectView value="1.0.0" onChange={mockOnChange} packages={mockPackages} />);
    expect(screen.getByTestId('DC_versionSelect_dropdown')).toBeInTheDocument();
    const appVersion = document.getElementById('appVersion');
    expect(appVersion.value).toEqual('1.0.0');
  });

  it('should render versions when open select', async () => {
    render(<AppVersionsSelectView value="1.0.0" onChange={mockOnChange} packages={mockPackages} />);

    const select = screen.getByTestId('DC_versionSelect_dropdown');

    fireEvent.mouseDown(select.firstChild);

    expect(
      screen.getByTestId('DC_versionSelect_option_Beta - no beta versionMenuItem')
    ).toBeInTheDocument();
    expect(screen.getByTestId('DC_versionSelect_option_v1.1.0 MenuItem')).toBeInTheDocument();
  });

  it('should call onChange when selecting a labeled version', async () => {
    render(<AppVersionsSelectView value="1.0.0" onChange={mockOnChange} packages={mockPackages} />);

    const select = screen.getByTestId('DC_versionSelect_dropdown');

    fireEvent.mouseDown(select.firstChild);

    screen.getByTestId('DC_versionSelect_option_Stable Release v1.0.0 - test noteMenuItem').click();

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('PROD', mockPackages[0]);
  });

  it('should call onChange when selecting an unlabeled version', () => {
    render(<AppVersionsSelectView value="1.0.0" onChange={mockOnChange} packages={mockPackages} />);

    const select = screen.getByTestId('DC_versionSelect_dropdown');

    fireEvent.mouseDown(select.firstChild);

    screen.getByTestId('DC_versionSelect_option_v1.1.0 MenuItem').click();
    expect(mockOnChange).toHaveBeenCalledWith('1.1.0', mockPackages[1]);
  });
});
