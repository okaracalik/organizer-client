// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tasks = sequelizeClient.define(
    'tasks',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: null
      },
      parent_id: {
        type: DataTypes.BIGINT,
        defaultValue: null
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      colors: DataTypes.ARRAY(DataTypes.STRING)
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  tasks.associate = function(models) {
    tasks.belongsToMany(models.tags, {
      as: 'tags',
      through: 'task_tags',
      foreignKey: 'fk_tasks'
    });
    tasks.belongsToMany(models.occurrences, {
      as: 'occurrences',
      through: 'task_occurrences',
      foreignKey: 'fk_tasks'
    });
  };

  return tasks;
};
