// tracks current visitors on the site
const _visitors = new Map()

export const visitors = {
  get: id => {
    return !id ? false : _visitors.get(id)
  },

  set: (id, createdAt) => {
    _visitors.set(id, createdAt)
  },

  delete: id => {
    _visitors.delete(id)
  },

  size: () => {
    return _visitors.size
  },

  flush: ttl => {
    const now = Date.now()

    for (let visitor of _visitors) {
      const [id, createdAt] = visitor
      if (now - createdAt > ttl) {
        _visitors.delete(id)
      }
    }
  },
}
