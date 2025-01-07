import { render, waitFor, act } from '@testing-library/react';
import Jsona from 'jsona';
import usePackages from '../effects';
import { getAppPackages } from '~/clients/jsonApi';

jest.mock('~/clients/jsonApi');

const mockResponse = [
  {
    id: '1',
    type: 'packages',
    attributes: {
      name: 'Package 1',
    },
  },
  {
    id: '2',
    type: 'packages',
    attributes: {
      name: 'Package 2',
    },
  },
];

const mockAppId = '123';
const mockQueryParams = { filter: { foo: 'bar' } };

describe('usePackages', () => {
  it('should return packages and set isLoading to false when getAppPackages succeeds', async () => {
    getAppPackages.mockResolvedValueOnce(mockResponse);

    let result;

    const TestComponent = () => {
      result = usePackages(mockAppId, mockQueryParams);
      return null;
    };

    render(<TestComponent />);

    await waitFor(() => expect(result.isLoading).toBe(false));

    act(() => {
      const dataFormatter = new Jsona();
      expect(result.packages).toEqual(dataFormatter.deserialize(mockResponse));
    });
  });

  it('should set isLoading to false and set error when getAppPackages fails', async () => {
    const error = new Error('Failed to fetch packages');

    getAppPackages.mockRejectedValueOnce(error);

    let result;

    const TestComponent = () => {
      result = usePackages(mockAppId, mockQueryParams);
      return null;
    };

    render(<TestComponent />);

    await waitFor(() => expect(result.isLoading).toBe(false));

    act(() => {
      expect(result.error).toBe(error);
    });
  });
});
