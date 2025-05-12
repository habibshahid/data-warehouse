const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yovo_tbl_channels', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    channel: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    view: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: "0 = inactive, 1 = active"
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    campaign_available: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    file_config: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'yovo_tbl_channels',
    timestamps: false,
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
