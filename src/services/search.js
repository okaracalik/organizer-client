import Service from './http'

export default {
  apply (service, term) {
    return Service(service).find(this.composeSearchQuery(term))
  },
  composeSearchQuery (term) {
    return {
      params: {
        search: term
      }
    }
  }
}
