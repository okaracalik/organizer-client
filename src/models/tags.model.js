// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tags = sequelizeClient.define(
    'tags',
    {
      pk_tags: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      colors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['#ffffff', '#000000']
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
    // lists
    tags.belongsToMany(models.lists, {
      as: 'lists',
      through: 'list_tags',
      foreignKey: 'fk_tags'
    });
    // items
    tags.belongsToMany(models.items, {
      as: 'tags',
      through: 'item_tags',
      foreignKey: 'fk_tags'
    });
    // tasks
    tags.belongsToMany(models.tasks, {
      as: 'tasks',
      through: 'task_tags',
      foreignKey: 'fk_tags'
    });
  };

  return tags;
};
