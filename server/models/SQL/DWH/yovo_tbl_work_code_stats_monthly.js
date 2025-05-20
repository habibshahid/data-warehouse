module.exports = function (sequelize, DataTypes) {

  return sequelize.define('yovo_tbl_work_code_stats_monthly', {
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
      agent: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: 'yovo_tbl_work_code_stats_monthly',
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