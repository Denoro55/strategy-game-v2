export const getQuery = (query: string, key: string): string | null => {
  const urlParams = new URLSearchParams(query);
  return urlParams.get(key);
}