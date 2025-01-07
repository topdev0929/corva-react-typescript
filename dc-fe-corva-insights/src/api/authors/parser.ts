import { InsightAuthor } from '@/entities/insight/author';

export const parseAuthorFromJSON = (obj: any): InsightAuthor => {
  return {
    id: obj.data.id,
    firstName: obj.data.attributes.first_name,
    lastName: obj.data.attributes.last_name,
    profilePhoto: obj.data.attributes.profile_photo,
  };
};
