module.exports = function (sequelize, DataTypes) {

  return sequelize.define('yovo_tbl_feedback_stats_half_hourly', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      pKey: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
      },
      channel: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      queue: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      authorType: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      value: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      appId: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      appName: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      interval: {
        type: DataTypes.STRING,
        required: true
      },
      timeInterval: {
        type: DataTypes.STRING,
        allowNull: false
      },
      intervalType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      week: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weekOfYear: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hour: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'yovo_tbl_feedback_stats_half_hourly',
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" },
          ]
        },
      ]
    });
};