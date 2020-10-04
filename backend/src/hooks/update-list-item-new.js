// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (!_.has(context.data, 'new_items')) {
      return context;
    }

    const sequelize = context.app.get('sequelizeClient');
    const items = await Promise.all(
      context.data.new_items.map(async i => await context.app.service('items').create(i))
    );

    // upsert list-items
    await Promise.all(
      items.map(async item => {
        let temp = await _.find(
          context.data.new_items,
          o => o.description === item.description
        );
        await sequelize.models.list_items.upsert({
          fk_lists: context.result.pk_lists,
          fk_items: item.pk_items,
          path: temp.list_items.path | null,
          checked: temp.list_items.checked | null,
          order: temp.list_items.order | null,
          enabled: temp.list_items.enabled | null
        });
      })
    );
    const res = await context.service.get(context.result.pk_lists);
    context.result = res;
    return context;
  };
};
