const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yovo_tbl_queues', {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    musiconhold: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    announce: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    context: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    timeout: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 25
    },
    monitor_join: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    monitor_format: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: "wav"
    },
    queue_youarenext: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queue_thereare: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queue_callswaiting: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queue_holdtime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queue_minutes: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queue_seconds: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queue_lessthan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queue_thankyou: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queue_reporthold: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    announce_frequency: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    announce_round_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    announce_holdtime: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    retry: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wrapuptime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "no in use"
    },
    maxlen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    servicelevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    strategy: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    joinempty: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: "yes"
    },
    leavewhenempty: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: "no"
    },
    eventmemberstatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    eventwhencalled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    reportholdtime: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    memberdelay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    timeoutrestart: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    periodic_announce: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    periodic_announce_frequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 60
    },
    ringinuse: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    setinterfacevar: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    setqueueentryvar: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    setqueuevar: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    autopause: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    autofill: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: "yes"
    },
    keepstats: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: "yes"
    },
    agent_moh: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    maxwaittime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rt_wrapuptime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    camp_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    announce_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    periodic_file_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    announce_file_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    queue_timeout: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    queue_opt_out: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    queue_opt_out_value: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    queue_opt_out_destination: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    disposition_mandatory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    pci_recording: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    pci_recording_control: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    delete_recording: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    on_abandon: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    queue_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "Internal"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wrapupstrict: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
      comment: "0=no, 1=yes"
    },
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    sms_gateway: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    email_gateway: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    disposition_items: {
      type: DataTypes.ENUM('single','multiple','single_auto_ready'),
      allowNull: true,
      defaultValue: "multiple"
    },
    out_route_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    open_transfer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    qa_form_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    queue_ring_timeout: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 30
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0=not deleted, 1=deleted"
    }
  }, {
    sequelize,
    tableName: 'yovo_tbl_queues',
    hasTrigger: true,
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
      {
        name: "name",
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
