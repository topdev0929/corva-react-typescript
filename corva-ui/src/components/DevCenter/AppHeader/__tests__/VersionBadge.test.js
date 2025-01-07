import { render, screen } from '@testing-library/react';

import { VersionBadge } from '../VersionBadge';

describe('VersionBadge', () => {
  it('should return NULL if there is no package', () => {
    const { container } = render(<VersionBadge />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should return NULL for prod label', () => {
    const { container } = render(<VersionBadge appPackage={{ label: 'PROD' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should return NULL for prod label', () => {
    const { getByText } = render(<VersionBadge appPackage={{ label: 'BETA' }} />);

    expect(getByText('Beta')).toBeInTheDocument();
  });

  it('should return actual version for package_code_version', () => {
    const { getByText } = render(<VersionBadge appPackage={{ package_code_version: '42' }} />);

    expect(getByText('v42')).toBeInTheDocument();
  });

  it('should return actual version for version', () => {
    const { getByText } = render(<VersionBadge appPackage={{ version: '42' }} />);

    expect(getByText('v42')).toBeInTheDocument();
  });

  it('should return actual version from package_code_version if both package_code_version and version are provided', () => {
    const { getByText } = render(
      <VersionBadge appPackage={{ package_code_version: '42', version: 'XXX' }} />
    );

    expect(getByText('v42')).toBeInTheDocument();
  });
});
