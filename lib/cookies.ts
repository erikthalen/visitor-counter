type ParsedCookies = {
  [key: string]: string
}

export const cookies = (cookieString: string | undefined): ParsedCookies => {
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
