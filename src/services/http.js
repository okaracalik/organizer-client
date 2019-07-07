import axios from 'axios'
import Qs from 'qs'

const base = 'http://localhost:3030'

const Service = name => ({
  find (query = null) {
    const q = { params: { '$sort[id]': -1 } }
    return axios.get(`${base}/${name}`, {
      ...q,
      ...query,
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      }
    })
  },
  get (id) {
    return axios.get(`${base}/${name}/${id}`)
  },
  create (data) {
    return axios.post(`${base}/${name}`, data)
  },
  update (id, data) {
    return axios.put(`${base}/${name}/${id}`, data)
  },
  remove (id) {
    return axios.delete(`${base}/${name}/${id}`)
  }
})

export default Service
