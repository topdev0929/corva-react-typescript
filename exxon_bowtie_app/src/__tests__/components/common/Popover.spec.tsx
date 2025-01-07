/* eslint-disable @typescript-eslint/no-empty-function */
import { render, fireEvent } from '@testing-library/react';

import { Popover } from '@/components/common/Popover';
import { Status } from '@/types/global.type';

export const mockData = {
  'Influx ID': {
    chips: [
      {
        label: 'Label 1',
        pvtIndexes: [0, 1],
        status: Status.Done,
        subData: [
          { header: 'Header 1', content: new Date() },
          { header: 'Header 2', content: new Date() },
        ],
        comments: [
          {
            status: Status.Critical,
            title: 'Comment Title 1',
            description: 'Comment Description 1',
            time: new Date(),
          },
          {
            status: Status.Info,
            title: 'Comment Title 2',
            description: 'Comment Description 2',
            time: new Date(),
          },
        ],
      },
      {
        label: 'Label 2',
        pvtIndexes: [2, 3],
        status: Status.Medium,
        subData: [
          { header: 'Header 1', content: new Date() },
          { header: 'Header 2', content: new Date() },
        ],
        comments: [
          {
            status: Status.Critical,
            title: 'Comment Title 1',
            description: 'Comment Description 1',
            time: new Date(),
          },
          {
            status: Status.Info,
            title: 'Comment Title 2',
            description: 'Comment Description 2',
            time: new Date(),
          },
        ],
      },
    ],
    commentTabs: ['Tab 1', 'Tab 2'],
  },
};

describe('Popover component', () => {
  test('renders title correctly', () => {
    const title = 'Influx ID';
    const { getByText } = render(
      <Popover
        title={title}
        anchorEl={document.createElement('button')}
        setAnchorEl={jest.fn()}
        source={mockData}
        setSource={jest.fn()}
        currentUser={{ company_id: 1 }}
        assetId={0}
      />
    );
    expect(getByText(title)).toBeInTheDocument();
  });

  test('renders subData correctly', () => {
    const { getByText } = render(
      <Popover
        title="Influx ID"
        anchorEl={document.createElement('button')}
        setAnchorEl={jest.fn()}
        source={mockData}
        setSource={jest.fn()}
        currentUser={{ company_id: 1 }}
        assetId={0}
      />
    );

    expect(getByText('Header 1')).toBeInTheDocument();
    expect(getByText('Header 2')).toBeInTheDocument();
  });

  test('renders comments correctly', () => {
    const { getByText } = render(
      <Popover
        title="Influx ID"
        anchorEl={document.createElement('button')}
        setAnchorEl={jest.fn()}
        source={mockData}
        setSource={jest.fn()}
        currentUser={{ company_id: 1 }}
        assetId={0}
      />
    );
    expect(getByText('Comment Title 1')).toBeInTheDocument();
    expect(getByText('Comment Description 1')).toBeInTheDocument();
    expect(getByText('Comment Title 2')).toBeInTheDocument();
    expect(getByText('Comment Description 2')).toBeInTheDocument();
  });

  test('calls handleClose when close button is clicked', () => {
    const handleClose = jest.fn();
    const { getByLabelText } = render(
      <Popover
        title="Influx ID"
        anchorEl={document.createElement('button')}
        setAnchorEl={handleClose}
        source={mockData}
        setSource={jest.fn()}
        currentUser={{ company_id: 1 }}
        assetId={0}
      />
    );
    fireEvent.click(getByLabelText('close-popover'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
