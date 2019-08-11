import Service from './http'
import { getLabels } from './utils'

export default {
  apply (service, term, sortColumn = 'id') {
    return Service(service).find(this.composeSearchQuery(term, sortColumn))
  },
  find (service, params) {
    return Service(service).find({ params })
  },
  composeSearchQuery (term, sortColumn) {
    return {
      params: {
        $search: term
      }
    }
  },
  prepareSearchResult (response, removedKeys = []) {
    const data = response.data.data ? response.data.data : response.data
    return data.map(item => {
      return Object.assign({}, item, {
        value: getLabels(item, removedKeys),
        label: getLabels(item, removedKeys)
      })
    })
  }
}
