export const stringifyPermission = ({
  ability,
  resource_class: resourceClass,
  resource_id: resourceId = '',
}) => `${ability}#${resourceClass}#${resourceId}`;

export const parsePermission = permission => {
  // eslint-disable-next-line camelcase
  const [ability, resource_class, resource_id] = permission.split('#');
  return { ability, resource_class, resource_id };
};
