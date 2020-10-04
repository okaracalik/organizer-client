// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (!_.has(context.data, 'new_tags')) {
      return context;
    }
    const sequelize = await context.app.get('sequelizeClient');
    // insert tags
    const tags = await sequelize.models.tags.bulkCreate(context.data.new_tags, {
      returning: true
    });
    // upsert tag-items
    await Promise.all(
      tags.map(async tag => {
        await sequelize.models.item_tags.upsert({
          fk_items: context.result.pk_items,
          fk_tags: tag.id
        });
      })
    );
    const res = await context.service.get(context.result.pk_items);
    context.result = res;
    return context;
  };
};
