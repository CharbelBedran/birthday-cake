export const assetUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return encodeURI(`${import.meta.env.BASE_URL}${normalizedPath}`);
};
