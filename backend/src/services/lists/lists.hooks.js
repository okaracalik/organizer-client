const extendList = require('../../hooks/extend-list');

const updateListTagExisting = require('../../hooks/update-list-tag-existing');

const updateListTagNew = require('../../hooks/update-list-tag-new');

const updateListItemExisting = require('../../hooks/update-list-item-existing');

const updateListItemNew = require('../../hooks/update-list-item-new');


module.exports = {
  before: {
    all: [],
    find: [extendList()],
    get: [extendList()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      updateListTagExisting(),
      updateListTagNew(),
      updateListItemExisting(),
      updateListItemNew()
    ],
    update: [
      updateListTagExisting(),
      updateListTagNew(),
      updateListItemExisting(),
      updateListItemNew()
    ],
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
