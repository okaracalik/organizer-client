// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // variables
    const PAYLOAD_FIELD = 'new_occurrences';
    const PAYLOAD_PK = 'pk_occurrences';
    const PAYLOAD_FK = 'fk_occurrences';
    const PAYLOAD_TABLE = 'occurrences';
    const MAIN_PK = 'pk_tasks';
    const MAIN_FK = 'fk_tasks';
    const TABLE_MIDDLE = 'task_occurrences';
    let ITEMS = null;
    // check payload
    if (!_.has(context.data, PAYLOAD_FIELD)) {
      return context;
    }
    const sequelize = await context.app.get('sequelizeClient');
    // insert payload
    ITEMS = await sequelize.models[PAYLOAD_TABLE].bulkCreate(context.data[PAYLOAD_FIELD], {
      returning: true
    }).map(i => i[PAYLOAD_PK]);
    // upsert to the middle-table
    await Promise.all(
      ITEMS.map(async item => {
        await sequelize.models[TABLE_MIDDLE].upsert({
          [MAIN_FK]: context.result[MAIN_PK],
          [PAYLOAD_FK]: item
        });
      })
    );
    // return
    const res = await context.service.get(context.result[MAIN_PK]);
    context.result = res;
    return context;
  };
};
