// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    context.params.sequelize = {
      include: [
        { model: sequelize.models.tasks, as: 'tasks' }
      ],
      raw: false,
    };
    return context;
  };
};