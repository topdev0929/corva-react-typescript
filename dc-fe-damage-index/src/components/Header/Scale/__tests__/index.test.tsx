import { render, fireEvent } from '@testing-library/react';
import { SCALE_TYPE } from '@/constants';
import { Scale } from '..';

describe('Scale component', () => {
    const defaultProps = {
        label: 'Test Scale',
        scale: [0, 0.5, 1.5, 4],
        setScale: jest.fn(),
        disabled: false,
        type: SCALE_TYPE.LOW,
    };

    it('renders the component with correct label', () => {
        const { getByText } = render(<Scale {...defaultProps} />);
        expect(getByText(defaultProps.label)).toBeInTheDocument();
    });

    it('calls setScale with correct values when changing minimum value input', () => {
        const { getByLabelText } = render(<Scale {...defaultProps} />);
        fireEvent.change(getByLabelText('Min Value'), { target: { value: '0.1' } });
        expect(defaultProps.setScale).toHaveBeenCalledWith([0.1, 0.5, 1.5, 4]);
    });

    it('calls setScale with correct values when changing maximum value input', () => {
        const { getByLabelText } = render(<Scale {...defaultProps} />);
        fireEvent.change(getByLabelText('Max Value'), { target: { value: '2.0' } });
        expect(defaultProps.setScale).toHaveBeenCalledWith([0, 0.5, 1.5, 4]);
    });

    it('disables input fields when disabled prop is true', () => {
        const { getByLabelText } = render(<Scale {...defaultProps} disabled />);
        expect(getByLabelText('Min Value')).toBeDisabled();
        expect(getByLabelText('Max Value')).toBeDisabled();
    });

    it('enables input fields when disabled prop is false', () => {
        const { getByLabelText } = render(<Scale {...defaultProps} disabled={false} />);
        expect(getByLabelText('Min Value')).toBeEnabled();
        expect(getByLabelText('Max Value')).toBeEnabled();
    });
});
