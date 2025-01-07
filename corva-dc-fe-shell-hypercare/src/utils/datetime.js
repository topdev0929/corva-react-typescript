export function getStatusTimestamp(str) {
  if (!str) return null;
  const regex = /(\d+)/;
  const match = str.match(regex);
  const result = match ? parseInt(match[0], 10) : null;
  return result;
}
