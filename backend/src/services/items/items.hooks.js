const updateItemTagExisting = require('../../hooks/update-item-tag-existing');

const extendItem = require('../../hooks/extend-item');

const updateItemTagNew = require('../../hooks/update-item-tag-new');

const searchItem = require('../../hooks/search-item');

module.exports = {
  before: {
    all: [],
    find: [extendItem(), searchItem()],
    get: [extendItem()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [updateItemTagExisting(), updateItemTagNew()],
    update: [updateItemTagExisting(), updateItemTagNew()],
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
