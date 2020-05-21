import { getInstance, observer } from './model.js'
import HTTP from '../../services/http'
import { parseISO } from 'date-fns'

const moduleName = 'occurrences'
const Service = HTTP(moduleName)

export const find = ({ commit }, query = null) => {
  Service.find(query)
    .then(res => {
      commit('listSuccess', res.data)
    })
    .catch(err => {
      commit('listError', err.response.data)
    })
}

export const get = ({ commit }, id) => {
  Service.get(id)
    .then(res => {
      commit('itemSuccess', {
        ...getInstance(),
        ...res.data,
        begins: parseISO(res.data.begins),
        ends: parseISO(res.data.ends),
        next: res.data.next.map(parseISO),
        done: res.data.done.map(parseISO),
        failed: res.data.failed.map(parseISO),
        skipped: res.data.skipped.map(parseISO)
      })
    })
    .catch(err => {
      commit('itemError', err.response.data)
    })
}

export const create = ({ commit }, data) => {
  Service.create(data)
    .then(res => {
      commit('formSuccess', res.data)
    })
    .catch(err => {
      commit('formError', err.response.data)
    })
}

export const update = ({ commit }, { id, data }) => {
  Service.update(id, data)
    .then(res => {
      commit('formSuccess', res.data)
    })
    .catch(err => {
      commit('formError', err.response.data)
    })
}

export const remove = ({ commit }, id) => {
  Service.remove(id)
    .then(res => {
      commit('formSuccess', res.data)
    })
    .catch(err => {
      commit('formError', err.response.data)
    })
}

export const set = ({ commit }, data) => {
  commit('formData', new Proxy({ ...getInstance(), ...data }, observer))
}
