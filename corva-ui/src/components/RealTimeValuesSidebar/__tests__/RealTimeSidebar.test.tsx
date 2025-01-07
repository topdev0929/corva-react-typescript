import { render, screen } from '@testing-library/react';

import { noop } from 'lodash';
import RealTimeSidebar from '../RealTimeSidebar';

describe('RealTimeSidebar', () => {
  const realTimeSidebarProps = {
    isSidebarOpen: false,
    handleOpenCloseSidebar: noop,
    isResponsive: true,
    sourceArray: [],
    findSource: noop,
    onAppSettingChange: noop,
    appSettings: {},
    assetKey: 'asset_key',
    setting: [],
    realTimeTypes: [],
    isDialogOpen: false,
    paramToEdit: null,
    handleOpenCloseDialog: noop,
    handleChangeParamToEdit: noop,
  };

  it('should render RealTimeSidebar', () => {
    const { getByTestId } = render(<RealTimeSidebar {...realTimeSidebarProps} />);

    expect(getByTestId('sidebar_footer')).toBeInTheDocument();
  });
});
