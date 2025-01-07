import { render } from '@testing-library/react';

import AppSettings from '../AppSettings';
import { mockAppSettingsProps } from '../__mocks__/mockAppSettingsProps';

describe('<AppSettings />', () => {
  it('should call onChange with a changed setting on settings change', async () => {
    const handleSettingsChange = jest.fn();

    render(<AppSettings {...mockAppSettingsProps} onSettingChange={handleSettingsChange} />);
  });
});
