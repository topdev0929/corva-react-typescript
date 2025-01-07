import { User } from '@/entities/user';

import { InsightAuthor } from './index';

export function getAuthorDataFromUser(user: User): InsightAuthor {
  const { id, profilePhoto, firstName, lastName } = user;
  return { id, profilePhoto, firstName, lastName };
}
