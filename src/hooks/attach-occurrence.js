// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    const query = sequelize.models.occurrences.update(
      {
        task_id: context.result.id
      },
      {
        where: {
          id: context.data.occurrences.map(o => o.id)
        }
      }
    );
    query
      .then(() => {
        return context;
      })
      .catch(() => {
        return context;
      });
  };
};
