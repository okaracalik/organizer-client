import * as DataStore from 'nedb'
import _ from 'lodash'

const convertToFirebaseObject = result =>
  _.reduce(result, (obj, value) => {
    return {
      ...obj,
      [value._id]: _.omit(value, ['_id'])
    }
  }, {})

export class LocalStorage {
  constructor (filename) {
    this.setDataStore(filename)
  }
  setDataStore (name = this.filename) {
    this.db = new DataStore({
      filename: 'organizer-' + name + '.db',
      autoload: true
    })
  }
  find () {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve({ data: convertToFirebaseObject(res) })
      })
    })
  }
  get (id) {
    return new Promise((resolve, reject) => {
      this.db.find(
        {
          _id: id
        },
        (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(convertToFirebaseObject(res))
        }
      )
    })
  }
  create (data) {
    return new Promise((resolve, reject) => {
      this.db.insert(data, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }
  update (id, data) {
    return new Promise((resolve, reject) => {
      this.db.update(
        {
          _id: id
        },
        data,
        {
          upsert: true
        },
        (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res)
        }
      )
    })
  }
  remove (id) {
    return new Promise((resolve, reject) => {
      this.db.remove(
        {
          _id: id
        },
        (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res)
        }
      )
    })
  }
}
