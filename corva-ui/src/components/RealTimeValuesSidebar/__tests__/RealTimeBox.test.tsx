import { fireEvent, render } from '@testing-library/react';
import RealTimeSidebarContext from '../RealTimeSidebarContext';
import { noop } from 'lodash';
import RealTimeBox from '../RealTimeValuesBox/RealTimeBox';

describe('RealTimeBox', () => {
  const handleOpenCloseDialog = jest.fn();
  const handleChangeParamToEdit = jest.fn();

  const realTImeBoxProps = {
    item: {
      name: 'test',
      value: 'test',
      key: 'test',
      color: 'red',
      unitType: 'length',
    },
    isDraggable: true,
    dragHandle: noop,
    itemSelected: null,
  };

  it('should render RealTimeBox', () => {
    const { getByTestId } = render(
      <RealTimeSidebarContext.Provider value={{ handleOpenCloseDialog, handleChangeParamToEdit }}>
        <RealTimeBox {...realTImeBoxProps} />
      </RealTimeSidebarContext.Provider>
    );

    expect(getByTestId('realtime_box')).toBeInTheDocument();
  });

  it('should open dialog', () => {
    const { getByTestId } = render(
      <RealTimeSidebarContext.Provider value={{ handleOpenCloseDialog, handleChangeParamToEdit }}>
        <RealTimeBox {...realTImeBoxProps} />
      </RealTimeSidebarContext.Provider>
    );

    const editButton = getByTestId(`test_edit_item`);
    fireEvent.click(editButton);

    expect(handleOpenCloseDialog).toHaveBeenCalledTimes(1);
    expect(handleChangeParamToEdit).toHaveBeenCalledTimes(1);
  });
});
