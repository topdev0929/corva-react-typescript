import { render } from '@testing-library/react';

import Comment from '@/components/Comment';
import { Status } from '@/types/global.type';

describe('Comment component', () => {
  test('renders title correctly', () => {
    const title = 'Test Title';
    const { getByText } = render(
      <Comment comment={{ time: new Date(), title, status: Status.Done, description: '' }} />
    );
    expect(getByText(title)).toBeInTheDocument();
  });

  test('renders description correctly', () => {
    const description = 'Test Description';
    const { getByText } = render(
      <Comment comment={{ time: new Date(), title: '', status: Status.Done, description }} />
    );
    expect(getByText(description)).toBeInTheDocument();
  });

  test('renders status icon correctly', () => {
    const title = 'Test Title';
    const { getByTestId } = render(
      <Comment comment={{ time: new Date(), title, status: Status.Critical, description: '' }} />
    );
    const warningIcon = getByTestId('warning-icon');
    expect(warningIcon).toBeInTheDocument();
  });

  test('renders info icon correctly', () => {
    const title = 'Test Title';
    const { getByTestId } = render(
      <Comment comment={{ time: new Date(), title, status: Status.Info, description: '' }} />
    );
    const infoIcon = getByTestId('info-icon');
    expect(infoIcon).toBeInTheDocument();
  });

  test('renders time correctly', () => {
    const title = 'Test Title';
    const time = new Date('2024-03-05T10:30:00');
    const { getByText } = render(
      <Comment comment={{ time, title, status: Status.Done, description: '' }} />
    );
    const formattedTime = '03/05/24 10:30';
    expect(getByText(formattedTime)).toBeInTheDocument();
  });
});
