// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const _ = require('lodash');
const { Op } = require('sequelize');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // variables
    const sequelize = await context.app.get('sequelizeClient');
    const PAYLOAD_FIELD = 'old_occurrences';
    const PAYLOAD_PK = 'pk_occurrences';
    const PAYLOAD_FK = 'fk_occurrences';
    const PAYLOAD_TABLE = 'occurrences';
    const MAIN_PK = 'pk_tasks';
    const MAIN_FK = 'fk_tasks';
    const TABLE_MIDDLE = 'task_occurrences';
    let ITEMS;
    // check payload
    if (!_.has(context.data, PAYLOAD_FIELD)) {
      return context;
    }
    // verify and extract payload
    // it does not let re-assignment of existing occurrences
    if (_.every(context.data[PAYLOAD_FIELD].map(i => _.has(i, PAYLOAD_PK)))) {
      ITEMS = await context.data[PAYLOAD_FIELD].map(i => i[PAYLOAD_PK]);
      await Promise.all(
        context.data[PAYLOAD_FIELD].map(async item => {
          await sequelize.models[PAYLOAD_TABLE].upsert(item);
        })
      );
    }
    else if (_.every(context.data[PAYLOAD_FIELD].map(i => _.isInteger(i)))) {
      ITEMS = await context.data[PAYLOAD_FIELD];
    }
    else {
      return context;
    }
    // upsert to the middle-table
    await Promise.all(
      ITEMS.map(async item => {
        await sequelize.models[TABLE_MIDDLE].upsert({
          [MAIN_FK]: context.result[MAIN_PK],
          [PAYLOAD_FK]: item
        });
      })
    );
    // find fks from the middle-table
    const REMOVING_PAYLOAD_FKS = await sequelize.models[TABLE_MIDDLE].findAll({
      where: {
        [MAIN_FK]: context.result[MAIN_PK],
        [PAYLOAD_FK]: {
          [Op.notIn]: ITEMS
        }
      }
    }).map(r => r.dataValues[PAYLOAD_FK]);
    // remove from payload table, so it auto-removes from the middle-table
    await sequelize.models[PAYLOAD_TABLE].destroy({
      where: {
        [PAYLOAD_PK]: {
          [Op.in]: REMOVING_PAYLOAD_FKS
        }
      }
    });

    const res = await context.service.get(context.result[MAIN_PK]);
    context.result = res;
    return context;
  };
};
