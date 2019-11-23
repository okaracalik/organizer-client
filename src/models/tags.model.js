// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tags = sequelizeClient.define(
    'tags',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      colors: DataTypes.ARRAY(DataTypes.STRING),
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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

  tags.associate = function(models) {
    tags.belongsToMany(models.lists, {
      as: 'lists',
      through: 'list_tags',
      foreignKey: 'fk_tags'
    });
    tags.belongsToMany(models.items, {
      as: 'tags',
      through: 'item_tags',
      foreignKey: 'fk_tags'
    });
    tags.belongsToMany(models.tasks, {
      as: 'tasks',
      through: 'task_tags',
      foreignKey: 'fk_tags'
    });
  };

  return tags;
};
