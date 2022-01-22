// parse cookies as { key: value }
export const cookies = cookieString => {
  return !cookieString
    ? {}
    : cookieString
        .split(';')
        .map(cookie => cookie.split('='))
        .reduce((obj, [key, val]) => {
          return {
            ...obj,
            [decodeURIComponent(key.trim())]: decodeURIComponent(val.trim()),
          }
        }, {})
}
