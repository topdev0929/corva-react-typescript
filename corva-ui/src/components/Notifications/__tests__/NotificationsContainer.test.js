import { render, fireEvent, act } from '@testing-library/react';

import { NOTIFICATION_VARIANTS } from '~/constants/notifications';

import { NotificationsContainer } from '../NotificationsContainer';
import { PAGE_NAME as TOAST_PAGE_NAME } from '../Toast';

const NOTIFICATION_TOASTS_SYMBOL = Symbol.for('notificationToasts');
const TEST_IDS = {
  ICON_ERROR: 'ReportOutlined',
  ICON_INFO: 'InfoOutlined',
  ICON_NEUTRAL: 'Check',
  ICON_SUCCESS: 'CheckCircleOutline',
  ICON_WARNING: 'ReportProblemOutlined',
};

jest.mock('@material-ui/icons', () => ({
  Check: () => <div data-testid={TEST_IDS.ICON_NEUTRAL} />,
  CheckCircleOutline: () => <div data-testid={TEST_IDS.ICON_SUCCESS} />,
  Close: () => <div />,
  InfoOutlined: () => <div data-testid={TEST_IDS.ICON_INFO} />,
  ReportOutlined: () => <div data-testid={TEST_IDS.ICON_ERROR} />,
  ReportProblemOutlined: () => <div data-testid={TEST_IDS.ICON_WARNING} />,
}));

describe('NotificationsContainer', () => {
  it('should render NotificationsContainer without errors', () => {
    const { container } = render(<NotificationsContainer />);

    expect(container).toBeInTheDocument();
  });

  it('should set notifications methods to window', () => {
    render(<NotificationsContainer />);
    const {
      createNotification,
      removeNotification,
      showErrorNotification,
      showInfoNotification,
      showNeutralNotification,
      showSuccessNotification,
      showWarningNotification,
    } = window[NOTIFICATION_TOASTS_SYMBOL];

    expect(typeof createNotification).toBe('function');
    expect(typeof removeNotification).toBe('function');
    expect(typeof showErrorNotification).toBe('function');
    expect(typeof showInfoNotification).toBe('function');
    expect(typeof showNeutralNotification).toBe('function');
    expect(typeof showSuccessNotification).toBe('function');
    expect(typeof showWarningNotification).toBe('function');
  });

  const NOTIFICATION_TEXT = 'notification text';

  describe('show notifications', () => {
    const testNotificationType = ({ type, methodName, iconTestId }) =>
      it(`should render correct text and icon for ${type} notification`, async () => {
        const { getByText, getByTestId } = render(<NotificationsContainer />);
        const showMessage = window[NOTIFICATION_TOASTS_SYMBOL][methodName];
        act(() => {
          showMessage(NOTIFICATION_TEXT);
        });

        expect(getByText(NOTIFICATION_TEXT)).toBeInTheDocument();
        expect(getByTestId(iconTestId)).toBeInTheDocument();
      });

    [
      {
        type: NOTIFICATION_VARIANTS.error,
        methodName: 'showErrorNotification',
        iconTestId: TEST_IDS.ICON_ERROR,
      },
      {
        type: NOTIFICATION_VARIANTS.info,
        methodName: 'showInfoNotification',
        iconTestId: TEST_IDS.ICON_INFO,
      },
      {
        type: NOTIFICATION_VARIANTS.neutral,
        methodName: 'showNeutralNotification',
        iconTestId: TEST_IDS.ICON_NEUTRAL,
      },
      {
        type: NOTIFICATION_VARIANTS.success,
        methodName: 'showSuccessNotification',
        iconTestId: TEST_IDS.ICON_SUCCESS,
      },
      {
        type: NOTIFICATION_VARIANTS.warning,
        methodName: 'showWarningNotification',
        iconTestId: TEST_IDS.ICON_WARNING,
      },
    ].forEach(testNotificationType);
  });

  describe('remove notification', () => {
    it('removes notification by using remove method', () => {
      const { queryByText, queryByTestId } = render(<NotificationsContainer />);
      const { showErrorNotification, removeNotification } = window[NOTIFICATION_TOASTS_SYMBOL];
      let notificationId = null;
      act(() => {
        notificationId = showErrorNotification(NOTIFICATION_TEXT);
      });

      expect(queryByText(NOTIFICATION_TEXT)).toBeInTheDocument();
      expect(queryByTestId(TEST_IDS.ICON_ERROR)).toBeInTheDocument();

      act(() => {
        removeNotification(notificationId);
      });

      expect(queryByText(NOTIFICATION_TEXT)).not.toBeInTheDocument();
      expect(queryByTestId(TEST_IDS.ICON_ERROR)).not.toBeInTheDocument();
    });

    it('it removes notification by clicking close button', () => {
      const { queryByText, queryByTestId } = render(<NotificationsContainer />);
      const { showErrorNotification } = window[NOTIFICATION_TOASTS_SYMBOL];
      act(() => {
        showErrorNotification(NOTIFICATION_TEXT);
      });

      expect(queryByText(NOTIFICATION_TEXT)).toBeInTheDocument();
      expect(queryByTestId(TEST_IDS.ICON_ERROR)).toBeInTheDocument();

      fireEvent.click(queryByTestId(`${TOAST_PAGE_NAME}_closeButton`));

      expect(queryByText(NOTIFICATION_TEXT)).not.toBeInTheDocument();
      expect(queryByTestId(TEST_IDS.ICON_ERROR)).not.toBeInTheDocument();
    });
  });
});
