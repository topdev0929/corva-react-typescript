import { corvaAPI } from '@corva/ui/clients';

import { InsightAuthor } from '@/entities/insight/author';
import { USER_API_PATH } from '@/constants';

import { parseAuthorFromJSON } from './parser';

export interface AuthorsApi {
  getAuthorById(id: number): Promise<InsightAuthor | undefined>;
  resetCache(): void;
}

export class AuthorsApiImpl implements AuthorsApi {
  private static instance: AuthorsApi;
  #authorsCache: Map<number, InsightAuthor> = new Map();

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): AuthorsApi {
    if (!AuthorsApiImpl.instance) {
      AuthorsApiImpl.instance = new AuthorsApiImpl();
    }
    return AuthorsApiImpl.instance;
  }

  resetCache(): void {
    this.#authorsCache = new Map();
  }

  async getAuthorById(id: number): Promise<InsightAuthor | undefined> {
    if (this.#authorsCache.has(id)) {
      return this.#authorsCache.get(id);
    }
    const author = await corvaAPI.get(`${USER_API_PATH}/users/${id}`);
    const parsedAuthor = parseAuthorFromJSON(author);
    this.#authorsCache.set(id, parsedAuthor);
    return parsedAuthor;
  }
}

export const authorsApi = AuthorsApiImpl.getInstance();
