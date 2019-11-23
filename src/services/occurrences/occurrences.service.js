// Initializes the `occurrences` service on path `/occurrences`
const createService = require('feathers-sequelize');
const createModel = require('../../models/occurrences.model');
const hooks = require('./occurrences.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/occurrences', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('occurrences');

  service.hooks(hooks);
};
