
const extendTask = require('../../hooks/extend-task');

const upsertTaskNewOccurrences = require('../../hooks/upsert-task-new-occurrences');

const upsertTaskOldOccurrences = require('../../hooks/upsert-task-old-occurrences');

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
    create: [upsertTaskNewOccurrences(), upsertTaskOldOccurrences()],
    update: [upsertTaskNewOccurrences(), upsertTaskOldOccurrences()],
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
