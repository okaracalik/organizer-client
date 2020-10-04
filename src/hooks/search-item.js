module.exports = function() {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    if (context.params.query.hasOwnProperty('$search')) {
      context.params.sequelize = {
        where: {
          description: { [sequelize.Op.iRegexp]: context.params.query.$search }
        },
        include: [{ model: sequelize.models.tags, as: 'tags' }],
        raw: false
      };
      delete context.params.query.$search;
    }
    return context;
  };
};
