import { render, fireEvent } from '@testing-library/react';
import { COMPLETION_APP_TYPES } from '~/constants/completion';
import PadModeSelect from '../PadModeSelect';

describe('PadModeSelect', () => {
  const completionAppType = COMPLETION_APP_TYPES.padApp;
  const padModeSetting = {
    mode: 'default',
    selectedAssets: [],
  };
  const assets = [
    {
      id: '1',
      name: 'Asset 1',
      label: 'Asset 1 Label',
      status: 'running',
      type: 'pad',
    },
    {
      id: '2',
      name: 'Asset 2',
      label: 'Asset 2 Label',
      status: 'running',
      type: 'frac',
    },
    {
      id: '3',
      name: 'Asset 3',
      label: 'Asset 3 Label',
      status: 'stopped',
      type: 'wireline',
    },
  ];
  const onChange = jest.fn();

  it('should render a select component', () => {
    const { getByRole } = render(
      <PadModeSelect
        completionAppType={completionAppType}
        padModeSetting={padModeSetting}
        assets={assets}
        onChange={onChange}
      />
    );

    const select = document.getElementById('mui-component-select-padModeSelect');
    expect(select).toBeInTheDocument();
  });

  it('should render default menu items when default mode is selected', () => {
    const { getByRole } = render(
      <PadModeSelect
        completionAppType={completionAppType}
        padModeSetting={padModeSetting}
        assets={assets}
        onChange={onChange}
      />
    );

    const select = document.getElementById('mui-component-select-padModeSelect');
    fireEvent.mouseDown(select.firstChild);

    const menuItem1 = getByRole('option', { name: /Asset 1/i });
    const menuItem2 = getByRole('option', { name: /Asset 2/i });
    const menuItem3 = getByRole('option', { name: /Asset 3/i });

    expect(menuItem1).toBeInTheDocument();
    expect(menuItem2).toBeInTheDocument();
    expect(menuItem3).toBeInTheDocument();
  });

  it('should render custom menu items when custom mode is selected', () => {
    const padModeSetting = {
      mode: 'custom',
      selectedAssets: ['2', '3'],
    };

    const { getByRole } = render(
      <PadModeSelect
        completionAppType={completionAppType}
        padModeSetting={padModeSetting}
        assets={assets}
        onChange={onChange}
      />
    );

    const select = document.getElementById('mui-component-select-padModeSelect');
    fireEvent.mouseDown(select.firstChild);

    const menuItem1 = getByRole('option', { name: /Asset 1/i });
    const menuItem2 = getByRole('option', { name: /Asset 2/i });

    expect(menuItem1).toBeInTheDocument();
    expect(menuItem2).toBeInTheDocument();
  });

  it('should call onChange when a menu item is selected', () => {
    const { getByRole } = render(
      <PadModeSelect
        completionAppType={completionAppType}
        padModeSetting={padModeSetting}
        assets={assets}
        onChange={onChange}
      />
    );

    const select = document.getElementById('mui-component-select-padModeSelect');
    fireEvent.mouseDown(select.firstChild);

    const menuItem1 = getByRole('option', { name: /Asset 1/i });
    fireEvent.click(menuItem1);

    expect(onChange).toHaveBeenCalledWith({ mode: 'custom', selectedAssets: [1] });
  });
});
