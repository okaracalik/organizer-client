module.exports = function() {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    if (context.params.query.hasOwnProperty('$search')) {
      context.params.sequelize = {
        where: { name: { [sequelize.Op.iRegexp]: context.params.query.$search } }
      };
      delete context.params.query.$search;
    }
    return context;
  };
};
