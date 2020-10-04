
const extendOccurrence = require('../../hooks/extend-occurrence');
module.exports = {
  before: {
    all: [],
    find: [extendOccurrence()],
    get: [extendOccurrence()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
