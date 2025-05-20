module.exports = function (sequelize, DataTypes) {

  return sequelize.define('yovo_tbl_agent_summary_stats_monthly', {

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
      loginTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      loginCounts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      breakTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      breakCounts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      notAvailableTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      notAvailableCounts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      idleTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      idleCounts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      manualOutboundTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      manualOutboundCounts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      acwTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      acwCounts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      holdTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      holdCounts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalInboundInteractions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalInboundInteractionsOccupancy: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      talkTimeInbound: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      totalInboundInteractionsCountAssignAcceptJoin: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalInboundInteractionsCountSharedTransfer: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      outboundInteractionsOccupancy: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalOutboundInteractionsCountJoin: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalOutboundInteractionsCountSharedTransfer: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ringNoAnswerRejected: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ringNoAnswerTimeout: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ringNoAnswerSIPError: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ringNoAnswerSIPUnavailable: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ringNoAnswerInboxDisabled: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ringNoAnswerAlreadyOnCall: {
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
      tableName: 'yovo_tbl_agent_summary_stats_monthly',
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