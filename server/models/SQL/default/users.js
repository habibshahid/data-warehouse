/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USERS', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ip_address: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    activation_code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    forgotten_password_code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    forgotten_password_time: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true
    },
    remember_code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    created_on: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    last_login: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    phone1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    phone2: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    member_of_org_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    location_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'assets/img/admin_avatar.png'
    },
    sippeer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sip_interface: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_agent: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    shift_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    autologoff: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    first_login: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    default_ob_camp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    logged_in: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    c2c: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    auto_ready_on_login: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    chat_autoanswer: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    man_out_auto_ready: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '-1'
    },
    is_api_user: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    api_password: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    last_password_update: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    user_type: {
      type: DataTypes.ENUM('cx9','api','customer'),
      allowNull: true
    },
    apiToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'yovo_tbl_users',
    timestamps: false
  });
};