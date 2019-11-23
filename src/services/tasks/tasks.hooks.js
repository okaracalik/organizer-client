
const extendTask = require('../../hooks/extend-task');

module.exports = {
  before: {
    all: [],
    find: [extendTask()],
    get: [extendTask()],
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
