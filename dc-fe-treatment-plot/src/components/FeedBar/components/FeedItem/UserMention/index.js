import { jsonApi } from '@corva/ui/clients';
import { UniversalLink, UserCardPopover } from '@corva/ui/components';

import { USER_MARKUP, PLACEHOLDERS } from './constants';

const escapeString = str => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const markupToRegex = markup => {
  const escapedMarkup = escapeString(markup);
  const charAfterDisplay =
    markup[markup.indexOf(PLACEHOLDERS.display) + PLACEHOLDERS.display.length];
  const charAfterId = markup[markup.indexOf(PLACEHOLDERS.display) + PLACEHOLDERS.display.length];
  return new RegExp(
    escapedMarkup
      .replace(PLACEHOLDERS.display, `([^${escapeString(charAfterDisplay || '')}]+?)`)
      .replace(PLACEHOLDERS.id, `([^${escapeString(charAfterId || '')}]+?)`),
    'g'
  );
};

export const formatMentionText = (
  text,
  mentionedUsers,
  isNativeView,
  color = '#039be5',
  currentUser
) => {
  if (!text) return text;

  const regexp = markupToRegex(USER_MARKUP);
  const parts = text.split(regexp);

  // NOTE: Because we have 2 groups in our regexp
  // every 2nd element will be the user id
  // every 3rd element will be the user name

  const n = 3; // NOTE: Match/User ID/User name
  const componentParts = parts.reduce((acc, p, i) => {
    const newParts = acc;

    if ((i % n) - 1 === 0) {
      const userName = `@${parts[i + 1]}`;
      const user =
        mentionedUsers &&
        mentionedUsers.length &&
        mentionedUsers.find(item => item.id === Number(p));

      const part =
        user && !isNativeView ? (
          <UserCardPopover
            user={user}
            wrapperStyle={{ display: 'inline-block', color }}
            // eslint-disable-next-line react/no-array-index-key
            key={`userCard-${i}`}
            currentUser={currentUser}
          >
            {userName}
          </UserCardPopover>
        ) : (
          // NOTE: Disable link since user profile for mobile is not completed
          // eslint-disable-next-line react/no-array-index-key
          <UniversalLink href={`/config/users/${p}`} key={`userLink-${i}`}>
            {userName}
          </UniversalLink>
        );

      newParts.push(part);
    }

    if (i % n === 0) newParts.push(p);

    return newParts;
  }, []);

  return componentParts;
};

const transformUserDataFromResponse = res =>
  res.data.map(item => ({
    id: item.id,
    display: `${item.first_name} ${item.last_name}`,
    photo: item.profile_photo,
    title: item.title,
  }));

export const handleFetchUsers = async (search, callback, companyId) => {
  if (!search) return callback([]);

  let res;
  try {
    res = await jsonApi.getUserAutocomplete(null, search, companyId);
  } catch (e) {
    console.error(e);
  }

  if (!res || res.data.length === 0) return callback([]);

  const usersData = transformUserDataFromResponse(res);

  return callback(usersData);
};

export const isSuggestionsListOpened = () => {
  const elements = document.getElementsByClassName('mention__suggestions__list');

  return elements.length > 0;
};
