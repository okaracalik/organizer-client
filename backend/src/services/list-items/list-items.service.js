// Initializes the `list-items` service on path `/list-items`
const { ListItems } = require('./list-items.class');
const createModel = require('../../models/list-items.model');
const hooks = require('./list-items.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/list-items', new ListItems(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('list-items');

  service.hooks(hooks);
};
