// NOTE: Get components based on "key" props specified
export function getStartComponent(components) {
  return components.find(
    item => item && item.key && (item.key.includes('filter') || item.key.includes('start'))
  );
}

export function getMiddleComponent(components) {
  return components.find(
    item => item && item.key && (item.key.includes('goal') || item.key.includes('middle'))
  );
}

export function getEndComponents(components) {
  return components.find(
    item => item && item.key && (item.key.includes('switch') || item.key.includes('end'))
  );
}