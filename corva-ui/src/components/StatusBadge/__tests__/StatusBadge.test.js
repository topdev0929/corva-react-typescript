import moment from 'moment';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { WARNING } from '../constants';

import { StatusBadge } from '../index';

const PAGE_NAME = 'Status_badge';

describe('StatusBadge', () => {
  const lastTimestamp = 111111;
  const appWidth = 500;
  const statusBadgeProps = {
    lastTimestamp,
    appWidth,
  };

  it('should render without errors', () => {
    const { getByTestId } = render(<StatusBadge {...statusBadgeProps} />);
    expect(getByTestId(PAGE_NAME)).toBeInTheDocument();
  });

  it('should render the timestamp', () => {
    const { getByText } = render(<StatusBadge {...statusBadgeProps} />);
    expect(getByText(`Last Update: ${moment.unix(lastTimestamp).format('M/D/YYYY h:mm a')}`)).toBeInTheDocument();
  });

  describe('Warning Data', () => {
    it('should render the warning icon and message when warningData prop is provided', () => {
      const warningData = { message: 'This is a warning message' };
      const { getByText } = render(<StatusBadge warningData={warningData} {...statusBadgeProps} appWidth={1000} />);
      expect(getByText(`${WARNING}. ${warningData.message}`)).toBeInTheDocument();
    });

    it('should render the warning icon and message with tooltip', async () => {
      const warningData = {};
      const { getByText, getByTestId } = render(<StatusBadge warningData={warningData} {...statusBadgeProps} />);
      const WarningIcon = getByTestId(`${PAGE_NAME}__DQ_icon_warning`);
      fireEvent.mouseEnter(WarningIcon);

      await waitFor(() => {
        expect(getByText(WARNING)).toBeInTheDocument();
      });
    });
  });

  describe('Error icon type', () => {
    it('should render the error icon when iconType prop is error', () => {
      const { getByTestId } = render(<StatusBadge iconType='error' {...statusBadgeProps} />);
      expect(getByTestId(`${PAGE_NAME}__DQ_icon_error`)).toBeInTheDocument();
    });

    it('should render the unvalidated content when iconType prop is error', async () => {
      const assetsData = {'Asset 2': [
        {id: 21, name: 'Costs', isResolved: true, missingNum: 24, issuesNum: 22, alert: { statusUpdatedAt: 111111 } },
        {id: 24, name: 'Daily Reports', missingNum: 2, issuesNum: 3, alert: { statusUpdatedAt: 111111 } },
        {id: 44, name: 'Casing', missingNum: 2, issuesNum: 0, alert: { statusUpdatedAt: 111111 } },
      ]};
      const { getByText, getByTestId } = render(<StatusBadge iconType="error" {...statusBadgeProps} assetsData={assetsData} />);
      const ErrorIcon = getByTestId(`${PAGE_NAME}__DQ_icon_error`);

      fireEvent.mouseEnter(ErrorIcon);

      await waitFor(() => {
        expect(getByText('Data Quality')).toBeInTheDocument();
      });
    });
  });

  describe('Success icon type', () => {
    it('should render the success icon when iconType prop is success', () => {
      const { getByTestId } = render(<StatusBadge iconType='success' {...statusBadgeProps} />);
      expect(getByTestId(`${PAGE_NAME}__DQ_icon_success`)).toBeInTheDocument();
    });

    it('should render the success content when iconType prop is success', async () => {
      const { getAllByText, getByText, getByTestId } = render(<StatusBadge iconType="success" {...statusBadgeProps} />);
      const SuccessIcon = getByTestId(`${PAGE_NAME}__DQ_icon_success`);
      fireEvent.mouseEnter(SuccessIcon);

      await waitFor(() => {
        const openModalButton = getAllByText('report data issue');
        fireEvent.click(openModalButton[0]);

        expect(getByText('Report Data Quality Issue')).toBeInTheDocument();
      });
    });
  });
});
