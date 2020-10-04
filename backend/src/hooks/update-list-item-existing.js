// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (!_.has(context.data, 'items')) {
      return context;
    }

    const sequelize = context.app.get('sequelizeClient');
    // upsert list-items
    await Promise.all(
      context.data.items.map(async item => {
        await sequelize.models.list_items.upsert({
          pk_list_items: item.list_items.pk_list_items | null,
          fk_lists: context.result.pk_lists,
          fk_items: item.pk_items,
          path: item.list_items.path | null,
          checked: item.list_items.checked | null,
          order: item.list_items.order | null,
          enabled: item.list_items.enabled | null
        });
      })
    );
    // remove old list-items
    await sequelize.models.list_items.destroy({
      where: {
        fk_lists: context.result.pk_lists,
        fk_items: {
          [sequelize.Op.notIn]: context.data.items.map(i => i.pk_items | i)
        }
      }
    });
    const res = await context.service.get(context.result.pk_lists);
    context.result = res;
    return context;
  };
};
