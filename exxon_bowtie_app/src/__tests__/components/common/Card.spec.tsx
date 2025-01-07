import { render, fireEvent, waitFor } from '@testing-library/react';

import { Card } from '@/components/common/Card';
import { Status } from '@/types/global.type';

describe('Card Component', () => {
  const testSource = {
    'Test Title': {
      chips: [
        {
          label: 'Critical Chip',
          pvtIndexes: [10, 3],
          status: Status.Critical,
          subData: [
            {
              header: 'Open Date',
              content: new Date(),
            },
            {
              header: 'Close Date',
              content: new Date(),
            },
          ],
          comments: [
            {
              status: Status.Critical,
              title: 'L.Flores',
              description:
                'Eurofins provided an update about the sampling logistics, informed about the sample to be delivered by 9/1.',
              time: new Date(),
            },
          ],
        },
      ],
      commentTabs: ['All', 'Documents', 'Photos'],
    },
  };
  it('renders Card component with default props', () => {
    const { getByText, getByTestId } = render(<Card data-testid="card" title="Test Card" />);

    const cardElement = getByTestId('card');
    const titleElement = getByText('Test Card');

    expect(cardElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
  });

  it('renders Card component with custom props and handles click event', () => {
    const onClickMock = jest.fn();
    const { getByText, getByTestId } = render(
      <Card
        data-testid="card"
        title="Test Card"
        fontStyle={{ fontFamily: 'Arial', fontSize: '20px', fontWeight: 600, lineHeight: '24px' }}
        onClick={onClickMock}
      />
    );

    const cardElement = getByTestId('card');
    const titleElement = getByText('Test Card');

    expect(cardElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle('font-family: Arial');
    expect(titleElement).toHaveStyle('font-size: 20px');
    expect(titleElement).toHaveStyle('font-weight: 600');
    expect(titleElement).toHaveStyle('line-height: 24px');

    fireEvent.click(cardElement);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('renders tooltip with chip data on hover when source is provided', async () => {
    const { getByTestId, queryByText } = render(
      <Card data-testid="card" title="Test Title" source={testSource} />
    );

    const cardElement = getByTestId('card');
    fireEvent.mouseEnter(cardElement);

    await waitFor(() => {
      const criticalChip = queryByText('Critical Chip');
      expect(criticalChip).toBeInTheDocument();
    });
  });

  it('does not render tooltip when source is not provided', () => {
    const { getByTestId, queryByText } = render(<Card data-testid="card" title="Test Title" />);

    const cardElement = getByTestId('card');
    fireEvent.mouseEnter(cardElement);

    const criticalChip = queryByText('Critical Chip');

    expect(criticalChip).toBeNull();
  });
});
