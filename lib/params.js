export const params = (req, param) => {
  const query = url.parse(req.url, true).query
  return query[param] || typeof query[param] === 'string'
}