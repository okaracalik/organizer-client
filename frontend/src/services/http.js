import axios from 'axios'

// const base = 'https://localhost/api/organizer'
const base = 'https://orkutkaracalik.info/api/organizer'

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