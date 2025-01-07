import { COMPONENT_FAMILIES } from '~/constants/casing';

import { convertValue } from '../convert';

export function getFamilyName(type) {
  const family = COMPONENT_FAMILIES.find(item => item.type === type);
  return family ? family.name : '';
}

export function convertComponents(components) {
  const converted = [];
  let cumLength = 0;

  for (let i = 0; i < components.length; i += 1) {
    const component = components[i];

    const newComponent = {
      ...component,
      family_name: getFamilyName(component.family),
      inner_diameter: convertValue(component.inner_diameter, 'shortLength', 'in'),
      outer_diameter: convertValue(component.outer_diameter, 'shortLength', 'in'),
      linear_weight: convertValue(component.linear_weight, 'massPerLength', 'lb-ft'),
      weight: convertValue(component.linear_weight, 'mass', 'lb'),
      length: convertValue(component.linear_weight, 'length', 'ft'),
    };

    cumLength += newComponent.length;
    newComponent.cum_length = cumLength;
    converted.push(newComponent);
  }

  return converted;
}
