
const extendTask = require('../../hooks/extend-task');

const upsertTaskNewOccurrences = require('../../hooks/upsert-task-new-occurrences');
const upsertTaskOldOccurrences = require('../../hooks/upsert-task-old-occurrences');
const upsertTaskNewTags = require('../../hooks/upsert-task-new-tags');
const upsertTaskOldTags = require('../../hooks/upsert-task-old-tags');

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
    create: [upsertTaskOldOccurrences(), upsertTaskNewOccurrences(), upsertTaskOldTags(), upsertTaskNewTags()],
    update: [upsertTaskOldOccurrences(), upsertTaskNewOccurrences(), upsertTaskOldTags(), upsertTaskNewTags()],
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
