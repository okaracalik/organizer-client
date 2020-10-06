import axios from 'axios'

const base = process.env.PROD ? 'https://orkutkaracalik.info/api/organizer' : 'http://localhost:3031'

const Service = name => ({
  find (query = null) {
    return axios.get(`${base}/${name}`, { ...query })
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
