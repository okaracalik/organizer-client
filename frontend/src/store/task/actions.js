import { getInstance } from './model.js'
import HTTP from '../../services/http'
import { parseISO } from 'date-fns'

const moduleName = 'tasks'
const Service = HTTP(moduleName)

export const find = ({ commit }, query = null) => {
  Service.find(query)
    .then(res => {
      commit('listSuccess', {
        ...res.data,
        data: res.data.data.map(d => ({
          ...d,
          occurrences: d.occurrences.map(o => ({
            ...o,
            begins: parseISO(o.begins),
            ends: parseISO(o.ends),
            next: o.next.map(parseISO),
            done: o.done.map(parseISO),
            failed: o.failed.map(parseISO),
            skipped: o.skipped.map(parseISO)
          }))
        }))
      })
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
        occurrences: res.data.occurrences.map(o => ({
          ...o,
          begins: parseISO(o.begins),
          ends: parseISO(o.ends),
          next: o.next.map(parseISO),
          done: o.done.map(parseISO),
          failed: o.failed.map(parseISO),
          skipped: o.skipped.map(parseISO)
        }))
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
  commit('formData', { ...getInstance(), ...data })
}
