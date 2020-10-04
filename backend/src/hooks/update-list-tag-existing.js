// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
// const async = require('async');
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (!_.has(context.data, 'tags')) {
      return context;
    }

    const tags = await context.data.tags.map(t => t.id | t);
    const sequelize = await context.app.get('sequelizeClient');
    // upsert list-tags
    await Promise.all(
      tags.map(async tag => {
        await sequelize.models.list_tags.upsert({
          fk_lists: context.result.pk_lists,
          fk_tags: tag
        });
      })
    );
    // remove old list-tags
    await sequelize.models.list_tags.destroy({
      where: {
        fk_lists: context.result.pk_lists,
        fk_tags: {
          [sequelize.Op.notIn]: tags
        }
      }
    });

    const res = await context.service.get(context.result.pk_lists);
    context.result = res;
    return context;
  };
};
