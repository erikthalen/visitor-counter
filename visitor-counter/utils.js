import url from 'url'

const getQuery = u => url.parse(u, true).query
const getParameters = parameter => {
  return typeof parameter === 'string' || parameter
}

export const params = (req, query) => {
  const parameter = getQuery(req.url)
  const q = getParameters(parameter[query])

  if (!q) return null

  return parameter[query] || typeof parameter[query] === 'string'
}
