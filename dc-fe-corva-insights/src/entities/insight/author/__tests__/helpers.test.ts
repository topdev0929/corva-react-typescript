import { mockedInsightAuthor } from '@/mocks/insight';
import { mockedUser } from '@/mocks/user';

import { getAuthorDataFromUser } from '../helpers';

describe('Author Helpers', () => {
  describe('getAuthorDataFromUser', () => {
    it('should return author data', () => {
      const result = getAuthorDataFromUser(mockedUser);
      expect(result).toEqual({
        id: mockedInsightAuthor.id,
        profilePhoto: mockedInsightAuthor.profilePhoto,
        firstName: mockedInsightAuthor.firstName,
        lastName: mockedInsightAuthor.lastName,
      });
    });
  });
});
