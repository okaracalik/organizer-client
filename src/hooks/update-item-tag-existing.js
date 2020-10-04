// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (!_.has(context.data, 'tags')) {
      return context;
    }

    // get tag primary keys from either objects or array
    const tags = await context.data.tags.map(t => t.id | t);
    const sequelize = await context.app.get('sequelizeClient');
    // upsert tag-items
    await Promise.all(
      tags.map(async tag => {
        await sequelize.models.item_tags.upsert({
          fk_items: context.result.pk_items,
          fk_tags: tag
        });
      })
    );
    // remove old tag-items
    await sequelize.models.item_tags.destroy({
      where: {
        fk_items: context.result.pk_items,
        fk_tags: {
          [sequelize.Op.notIn]: tags
        }
      }
    });
    const res = await context.service.get(context.result.pk_items);
    context.result = res;
    return context;
  };
};
