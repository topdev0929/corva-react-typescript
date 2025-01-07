import get from 'lodash/get';

function isAdmin(user) {
  return user.role === 'admin';
}

function isCorvaAdmin(user) {
  return isAdmin(user) && get(user, ['company', 'provider'], null) === 'corva';
}

const PERMISSION_RULES = {
  is_admin: isAdmin,
  is_corva_admin: isCorvaAdmin,
};

function checkUserPermissionByKey(user, key) {
  if (key in PERMISSION_RULES) {
    return PERMISSION_RULES[key](user);
  }

  throw new Error(`There is no rule ${key}, please check the spelling`);
}

export default function checkUserPermissions(user, permissions = []) {
  return permissions.reduce(
    (isAllowed, rule) => isAllowed && checkUserPermissionByKey(user, rule),
    true
  );
}
