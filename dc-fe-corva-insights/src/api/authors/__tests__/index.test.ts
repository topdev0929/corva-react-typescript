import { corvaAPI } from '@corva/ui/clients';

import { InsightAuthor } from '@/entities/insight';

import { authorsApi, AuthorsApiImpl } from '../index';

jest.mock('@corva/ui/clients');

describe('AuthorsApi', () => {
  let authorObj: any;
  let author: InsightAuthor;

  beforeEach(() => {
    authorObj = {
      data: {
        id: 1,
        attributes: {
          first_name: 'John',
          last_name: 'Doe',
          profile_photo: 'https://example.com/photo.jpg',
        },
      },
    };
    author = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      profilePhoto: 'https://example.com/photo.jpg',
    };

    authorsApi.resetCache();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaAPI.get.mockReset();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaAPI.get.mockImplementation(() => Promise.resolve(authorObj));
  });

  it('should be a singleton', () => {
    expect(authorsApi).toBe(AuthorsApiImpl.getInstance());
  });

  it('should return author by id', async () => {
    const result = await authorsApi.getAuthorById(1);
    expect(result).toEqual(author);
    expect(corvaAPI.get).toHaveBeenCalledWith('/v2/users/1');
  });

  it('should return cached author by id', async () => {
    const firstResult = await authorsApi.getAuthorById(1);
    const secondResult = await authorsApi.getAuthorById(1);
    expect(firstResult).toEqual(author);
    expect(secondResult).toEqual(author);
    expect(corvaAPI.get).toHaveBeenCalledTimes(1);
  });
});
