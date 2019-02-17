import _ from 'lodash'

import model from './model'

export const setToolbar = ({ commit }, data = null) => commit('toolbar', { ...model.inputToolbar(), ...data })

export const setLoading = ({ commit }, data = null) => {
  if (_.isNull(data)) {
    commit('loading', model.inputLoading())
  }
  else {
    commit('loading', data)
  }
}
