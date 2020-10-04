// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const constructPath = (path, id) => {
  if (path.endsWith('/')) {
    return path + id + '/';
  }
  else {
    return path + '/' + id + '/';
  }
};

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    const query = sequelize.models.tasks.update(
      {
        path: context.result.path.endsWith('/'+context.result.id+'/') ? context.result.path : constructPath(context.result.path, context.result.id)
      },
      {
        where: {
          id: context.result.id
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
