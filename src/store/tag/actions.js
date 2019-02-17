import * as Utils from '../utils.js'
import { getInstance } from './model.js'
import { LocalStorage } from '../../services/local-storage'

const moduleName = 'tags'
const Service = new LocalStorage(moduleName)

export const find = ({
  commit
}, query = null) => {
  Utils.loading(commit)
  Service.find()
    .then(res => {
      commit('listSuccess', Utils.convertFirebaseResponse(res.data))
      Utils.loaded(commit)
    })
    .catch(err => {
      commit('listError', err.message)
      Utils.loaded(commit)
    })
}

export const get = ({ commit }, id) => {
  Utils.loading(commit)
  Service.get(id)
    .then(res => {
      commit('itemSuccess', { ...getInstance(), ...Utils.convertFirebaseResponse(res)[0] })
      Utils.loaded(commit)
    })
    .catch(err => {
      commit('itemError', err.message)
      Utils.loaded(commit)
    })
}

export const create = ({ commit }, data) => {
  Utils.loading(commit)
  Service.create(data)
    .then(res => {
      commit('formSuccess', res)
      Utils.loaded(commit)
    })
    .catch(err => {
      commit('formError', err.message)
      Utils.loaded(commit)
    })
}

export const update = ({ commit }, { id, data }) => {
  Utils.loading(commit)
  Service.update(id, data)
    .then(res => {
      commit('formSuccess', res)
      Utils.loaded(commit)
    })
    .catch(err => {
      commit('formError', err.message)
      Utils.loaded(commit)
    })
}

export const remove = ({ commit }, id) => {
  Utils.loading(commit)
  Service.remove(id)
    .then(res => {
      commit('formSuccess', res)
      Utils.loaded(commit)
    })
    .catch(err => {
      commit('formError', err.message)
      Utils.loaded(commit)
    })
}

export const set = ({ commit }, data) => {
  Utils.loading(commit)
  commit('formData', { ...getInstance(), ...data })
  Utils.loaded(commit)
}
