import { render, screen } from '@testing-library/react';
import { AppFilterPanelLayout } from '../AppFilterPanelLayout';
import * as mobileDetect from '~/utils/mobileDetect';
import * as useMatchAppContainerSize from '~/effects/useMatchAppContainerSize';

jest.mock('~/utils/mobileDetect', () => ({
  __esModule: true,
  isNativeDetected: false,
  isMobileDetected: false,
}));
jest.mock('~/effects/useMatchAppContainerSize', () => ({
  __esModule: true,
  useMatchAppContainerSize: () => false,
}));

const TEST_ID = {
  APP_SETTINGS_POPOVER: 'AppSettingsPopover',
  APP_SIDE_BAR: 'AppSideBar',
};
jest.mock('~/components/DevCenter/AppSettingsPopover/AppSettingsPopover', () => ({
  AppSettingsPopover: () => <div data-testid={TEST_ID.APP_SETTINGS_POPOVER} />,
}));
jest.mock('~/components/DevCenter/AppSideBar/AppSideBar', () => props => (
  <div data-testid={TEST_ID.APP_SIDE_BAR} {...props} />
));

describe('AppFilterPanelLayout', () => {
  it('renders without errors', () => {
    const { container } = render(<AppFilterPanelLayout />);

    expect(container).toBeInTheDocument();
  });

  it('renders children', () => {
    const CHILDREN_CONTENT = 'children';
    const { getByText } = render(<AppFilterPanelLayout>{CHILDREN_CONTENT}</AppFilterPanelLayout>);

    expect(getByText(CHILDREN_CONTENT)).toBeInTheDocument();
  });

  it('renders AppSettingsPopover by default', () => {
    const { getByTestId } = render(<AppFilterPanelLayout />);

    expect(getByTestId(TEST_ID.APP_SIDE_BAR)).toBeInTheDocument();
  });

  it('renders AppSideBar for MOBILE', () => {
    mobileDetect.isMobileDetected = true;
    mobileDetect.isNativeDetected = false;
    useMatchAppContainerSize.useMatchAppContainerSize = () => false;
    const { getByTestId } = render(<AppFilterPanelLayout />);

    expect(getByTestId(TEST_ID.APP_SETTINGS_POPOVER)).toBeInTheDocument();
  });

  it('renders AppSideBar for NATIVE', () => {
    mobileDetect.isMobileDetected = false;
    mobileDetect.isNativeDetected = true;
    useMatchAppContainerSize.useMatchAppContainerSize = () => false;
    const { getByTestId } = render(<AppFilterPanelLayout />);

    expect(getByTestId(TEST_ID.APP_SETTINGS_POPOVER)).toBeInTheDocument();
  });

  it('renders AppSideBar for SMALL APP VIEW', () => {
    mobileDetect.isMobileDetected = false;
    mobileDetect.isNativeDetected = false;
    useMatchAppContainerSize.useMatchAppContainerSize = () => true;
    const { getByTestId } = render(<AppFilterPanelLayout />);

    expect(getByTestId(TEST_ID.APP_SETTINGS_POPOVER)).toBeInTheDocument();
  });
});
