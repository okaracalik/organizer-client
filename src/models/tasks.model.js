// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tasks = sequelizeClient.define(
    'tasks',
    {
      pk_tasks: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      note: {
        type: DataTypes.TEXT,
        defaultValue: null
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

  tasks.associate = function(models) {
    // tags
    tasks.belongsToMany(models.tags, {
      as: 'tags',
      through: 'task_tags',
      foreignKey: 'fk_tasks'
    });
    // occurrences
    tasks.belongsToMany(models.occurrences, {
      as: 'occurrences',
      through: 'task_occurrences',
      foreignKey: 'fk_tasks'
    });
  };

  return tasks;
};
