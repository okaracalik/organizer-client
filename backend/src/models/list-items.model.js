// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const listItems = sequelizeClient.define(
    'list_items',
    {
      pk_list_items: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fk_lists: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fk_items: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true
      },
      checked: {
        type: DataTypes.BOOLEAN,
        default: false
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        default: true
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  // eslint-disable-next-line no-unused-vars
  listItems.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return listItems;
};
