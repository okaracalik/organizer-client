// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const occurrences = sequelizeClient.define(
    'occurrences',
    {
      begins: {
        type: DataTypes.DATE,
        allowNull: false
      },
      ends: {
        type: DataTypes.DATE,
        allowNull: false
      },
      n: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      frequency: {
        type: DataTypes.ENUM,
        values: ['once', 'day', 'week', 'month', 'year', 'custom'],
        defaultValue: 'once'
      },
      if_on_working_day: {
        type: DataTypes.ENUM,
        values: ['previous', 'closest', 'next'],
        defaultValue: 'next'
      },
      is_on_last_day_of_month: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      // ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      weekdays: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
        // validate: {
        //   check(value) {
        //     if (value.length > 0) {
        //       throw new Error('Total cannot be 0.0!');
        //     }
        //   }
        // }
      },
      next: {
        type: DataTypes.ARRAY(DataTypes.DATE),
        allowNull: true
      },
      succeeded: {
        type: DataTypes.ARRAY(DataTypes.DATE),
        allowNull: true
      },
      failed: {
        type: DataTypes.ARRAY(DataTypes.DATE),
        allowNull: true
      },
      skipped: {
        type: DataTypes.ARRAY(DataTypes.DATE),
        allowNull: true
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

  occurrences.associate = function(models) {
    occurrences.belongsToMany(models.tasks, {
      as: 'tasks',
      through: 'task_occurrences',
      foreignKey: 'fk_occurrences'
    });
  };

  return occurrences;
};
