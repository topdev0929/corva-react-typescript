export function getLocalStorageItem(itemKey) {
  return JSON.parse(localStorage.getItem(itemKey)) || {};
}

export function updateLocalStorageItem(itemKey, newData) {
  const localStorageItem = getLocalStorageItem(itemKey) || {};
  localStorage.setItem(itemKey, JSON.stringify({ ...localStorageItem, ...newData }));
}
