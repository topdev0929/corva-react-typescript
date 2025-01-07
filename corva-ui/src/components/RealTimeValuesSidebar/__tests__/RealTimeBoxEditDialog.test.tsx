import { noop } from 'lodash';

import { render, screen } from '@testing-library/react';

import RealTimeBoxEditDialog from '../RealTimeValuesBox/RealTimeBoxEditDialog';
import RealTimeSidebarContext from '../RealTimeSidebarContext';

describe('RealTimeBoxEditDialog', () => {
  const realTimeBoxDialogProps = {
    isDialogOpen: true,
    paramToEdit: null,
    handleCloseRealTimeDialog: noop,
  };

  it('should render RealTimeBoxEditDialog', () => {
    render(
      <RealTimeSidebarContext.Provider
        value={{
          onAppSettingChange: noop,
          appSettings: {},
          assetKey: 'test',
          realTimeTypes: [],
          setting: '',
          handleChangeParamToEdit: noop,
        }}
      >
        <RealTimeBoxEditDialog {...realTimeBoxDialogProps} />
      </RealTimeSidebarContext.Provider>
    );

    expect(screen.queryByText('Add/Edit Real-Time Parameter')).toBeInTheDocument();
  });
});
