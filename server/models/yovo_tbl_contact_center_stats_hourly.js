const { DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('yovo_tbl_contact_center_stats_hourly', {
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
      allowNull: false
    },
    queue: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    timeInterval: {
      type: DataTypes.STRING,
      required: true
    },
    inbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    queueWaitTimeMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    queueWaitTimeMax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    queueWaitTimeAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    queueWaitTimeTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    waitingOccupancyCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    waitingOccupancyTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    waitingCarryForward: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ivrHangupInbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ivrHangupOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    answeredInbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    answeredInTen: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    answeredMoreTenInTwenty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    answeredMoreTwentyInThirty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    answeredAfterThirty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    answeredWithinSetValue: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyInTen: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyMoreTenInTwenty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyMoreTwentyInThirty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyAfterThirty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyWithinSetValue: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyCountInbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyTimeInbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdTimeOccupancy: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdInbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdCountOccupancy: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedInbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedInTen: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedMoreTenInTwenty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedMoreTwentyInThirty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedAfterThirty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedWithinSetValue: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedOccupancyInTen: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedOccupancyMoreTenInTwenty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedOccupancyMoreTwentyInThirty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedOccupancyAfterThirty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedOccupancyWithinSetValue: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wrapUpTimeAgentAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wrapUpInbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    acwCounts:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    acwOccupancyCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    acwOccupancyTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wrapUpOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    closedOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    closedInbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    maxACW: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    minACW: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    acwTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wrapUpTimeInteractionAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wrapUpTimeInteractionMax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wrapUpTimeInteractionMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wrapUpTimeInteractionTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    inboundInteractionTimeAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    inboundInteractionTimeMax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    inboundInteractionTimeMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    inboundInteractionTimeTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    answeredAfterAbandoned: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    answeredOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyTimeOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    connectedOccupancyCountOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdCountOccupancyOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdTimeOccupancyOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    abandonedOutbound: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outboundBusy: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outboundFailed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outboundNotAnswer: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outboundCancel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outboundInteractionTimeAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outboundInteractionTimeMax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outboundInteractionTimeMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    outboundInteractionTimeTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completeByAgent: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completeByCaller: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdTimeMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdTimeMax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdTimeTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    holdTimeAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    agentTransfers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    applicationTransfers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    externalTransfers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    sharedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    firstResponseTimeAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    firstResponseTimeTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    firstResponseTimeMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    firstResponseTimeMax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    averageResponseTimeAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    averageResponseTimeTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    averageResponseTimeMax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    averageResponseTimeMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dialerCalls: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    handledByBot: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    handleTimeMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    handleTimeMax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    handleTimeTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    handleTimeAvg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
  }, {
    sequelize,
    tableName: 'yovo_tbl_contact_center_stats_hourly',
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
