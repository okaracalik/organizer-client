export const loading = commit => commit('app/loading', true, { root: true })

export const loaded = commit => commit('app/loading', false, { root: true })

export const convertFirebaseResponse = response =>
  Object.keys(response).map(key => {
    return Object.assign({}, response[key], { _id: key })
  })
