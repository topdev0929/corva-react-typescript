import { AuthorsApi } from '@/api/authors';
import { mockedInsightAuthor } from '@/mocks/insight';

export const mockedAuthorsApi: Omit<AuthorsApi, '#authorsCache'> = {
  getAuthorById: jest.fn().mockImplementation(() => Promise.resolve(mockedInsightAuthor)),
  resetCache: jest.fn(),
};
