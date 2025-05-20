module.exports = function (sequelize, DataTypes) {

  return sequelize.define('yovo_tbl_agent_summary_stats_yearly', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      timeInterval: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      loginTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      loginCounts: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      breakTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      breakCounts: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      notAvailableTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      notAvailableCounts: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      idleTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      idleCounts: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      manualOutboundTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      manualOutboundCounts: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      acwTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      acwCounts: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      holdTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      holdCounts: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalInboundInteractions: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalInboundInteractionsOccupancy: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      talkTimeInbound: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalInboundInteractionsCountAssignAcceptJoin: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalInboundInteractionsCountSharedTransfer: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalInboundInteractionTimeAssignAcceptJoin: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalInboundInteractionsTimeSharedTransfer: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      outboundInteractions: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      outboundInteractionsOccupancy: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalOutboundInteractionsCountJoin: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalOutboundInteractionsCountSharedTransfer: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      talkTimeOutbound: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalOutboundInteractionsTimeJoin: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalOutboundInteractionsTimeSharedTransfer: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalRingNoAnswers: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      ringNoAnswerRejected: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      ringNoAnswerTimeout: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      ringNoAnswerSIPError: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      ringNoAnswerSIPUnavailable: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      ringNoAnswerInboxDisabled: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      ringNoAnswerAlreadyOnCall: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
    },
    {
      sequelize,
      tableName: 'yovo_tbl_agent_summary_stats_yearly',
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