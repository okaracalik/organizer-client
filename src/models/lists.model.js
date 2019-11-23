// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const lists = sequelizeClient.define(
    'lists',
    {
      pk_lists: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mode: {
        type: DataTypes.ENUM,
        values: ['APPEND', 'PREPEND'],
        defaultValue: 'APPEND'
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

  lists.associate = function(models) {
    lists.belongsToMany(models.tags, {
      as: 'tags',
      through: 'list_tags',
      foreignKey: 'fk_lists'
    });
    lists.belongsToMany(models.items, {
      as: 'items',
      through: 'list_items',
      foreignKey: 'fk_lists'
    });
  };

  return lists;
};
