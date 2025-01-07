import { screen, render } from '@testing-library/react';

import Latency from '@/components/StreamboxStatus/Latency';

jest.useFakeTimers().setSystemTime(new Date('Mon Jul 24 2023 12:00:00'));

const getActivityTimestampMock = seconds =>
  new Date(`Mon Jul 24 2023 11:59:${seconds}`).getTime() / 1000;

describe('Latency', () => {
  it('should not show component when prop show is false', () => {
    render(<Latency show={false} activityTimestamp={0} />);

    expect(screen.queryByTestId('streambox-latency')).not.toBeInTheDocument();
  });

  it.each`
    activityTimestamp                | latency
    ${getActivityTimestampMock(55)}  | ${'5.0 s'}
    ${getActivityTimestampMock(10)}  | ${'50.0 s'}
    ${getActivityTimestampMock(NaN)} | ${'Invalid date s'}
  `(
    `should show latency $latency for timeStamp $activityTimestamp`,
    ({ latency, activityTimestamp }) => {
      render(<Latency show activityTimestamp={activityTimestamp} />);

      expect(screen.getByText(latency)).toBeInTheDocument();
    }
  );
});
