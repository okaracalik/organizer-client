// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const items = sequelizeClient.define(
    'items',
    {
      pk_items: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      description: {
        type: DataTypes.STRING,
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
  items.associate = function(models) {
    // tags
    items.belongsToMany(models.tags, {
      as: 'tags',
      through: 'item_tags',
      foreignKey: 'fk_items'
    });
    // lists
    items.belongsToMany(models.lists, {
      as: 'lists',
      through: 'list_items',
      foreignKey: 'fk_items'
    });
  };

  return items;
};
