import * as Utils from '../utils.js'
import { getInstance } from './model.js'
import { LocalStorage } from '../../services/local-storage'

const moduleName = 'tasks'
const Service = new LocalStorage(moduleName)

export const find = ({ commit }, query = null) => {
  Service.find()
    .then(res => {
      commit('listSuccess', Utils.convertFirebaseResponse(res.data))
    })
    .catch(err => {
      commit('listError', err.message)
    })
}

export const get = ({ commit }, id) => {
  Service.get(id)
    .then(res => {
      commit('itemSuccess', Utils.convertFirebaseResponse(res)[0])
    })
    .catch(err => {
      commit('itemError', err.message)
    })
}

export const create = ({ commit }, data) => {
  Service.create(data)
    .then(res => {
      commit('formSuccess', res)
    })
    .catch(err => {
      commit('formError', err.message)
    })
}

export const update = ({ commit }, { id, data }) => {
  Service.update(id, data)
    .then(res => {
      commit('formSuccess', res)
    })
    .catch(err => {
      commit('formError', err.message)
    })
}

export const remove = ({ commit }, id) => {
  Service.remove(id)
    .then(res => {
      commit('formSuccess', res)
    })
    .catch(err => {
      commit('formError', err.message)
    })
}

export const set = ({ commit }, data) => {
  commit('formData', { ...getInstance(), ...data })
}
