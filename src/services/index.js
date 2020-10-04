const tasks = require('./tasks/tasks.service.js');
const occurrences = require('./occurrences/occurrences.service.js');
const tags = require('./tags/tags.service.js');
const lists = require('./lists/lists.service.js');
const items = require('./items/items.service.js');
const listItems = require('./list-items/list-items.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(tasks);
  app.configure(occurrences);
  app.configure(tags);
  app.configure(lists);
  app.configure(items);
  app.configure(listItems);
};
