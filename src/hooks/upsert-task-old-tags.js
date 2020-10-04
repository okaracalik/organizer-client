// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const _ = require('lodash');
const { Op } = require('sequelize');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // variables
    const PAYLOAD_FIELD = 'old_tags';
    const PAYLOAD_PK = 'pk_tags';
    const PAYLOAD_FK = 'fk_tags';
    const MAIN_PK = 'pk_tasks';
    const MAIN_FK = 'fk_tasks';
    const TABLE_MIDDLE = 'task_tags';
    let ITEMS;
    // check payload
    if (!_.has(context.data, PAYLOAD_FIELD)) {
      return context;
    }
    // verify and extract payload
    if (_.every(context.data[PAYLOAD_FIELD].map(i => _.isInteger(i)))) {
      ITEMS = await context.data[PAYLOAD_FIELD];
    }
    else if (_.every(context.data[PAYLOAD_FIELD].map(i => _.has(i, PAYLOAD_PK)))) {
      ITEMS = await context.data[PAYLOAD_FIELD].map(i => i[PAYLOAD_PK]);
    }
    else {
      return context;
    }
    const sequelize = await context.app.get('sequelizeClient');
    // upsert to the middle-table
    await Promise.all(
      ITEMS.map(async item => {
        await sequelize.models[TABLE_MIDDLE].upsert({
          [MAIN_FK]: context.result[MAIN_PK],
          [PAYLOAD_FK]: item
        });
      })
    );
    // remove to the middle-table
    await sequelize.models[TABLE_MIDDLE].destroy({
      where: {
        [MAIN_FK]: context.result[MAIN_PK],
        [PAYLOAD_FK]: {
          [Op.notIn]: ITEMS
        }
      }
    });

    const res = await context.service.get(context.result[MAIN_PK]);
    context.result = res;
    return context;

  };
};
