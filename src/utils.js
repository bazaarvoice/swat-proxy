// If there's a trailing slash on the url, trim it
export const trimSlash = (str) => {
  if (str[str.length-1] === '/') {
    str = str.substring(0, str.length-1);
  }
  return str;
};
