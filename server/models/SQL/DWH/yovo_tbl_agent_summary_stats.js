module.exports = function (sequelize, DataTypes) {

  return sequelize.define('yovo_tbl_agent_summary_stats_15_min', {

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
      interval: {
        type: DataTypes.STRING,
        required: true
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

      /**
       * Timestamp for the record. Specifically start date of slot
       * Stored as a Unix timestamp in seconds.
       * @type {BigInt}
       * @property {Boolean} allowNull - Whether this field can be null.
       */
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
      // not working as at first they were logging with query based approach

      // outboundEmailsAsReplies: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // outboundEmailsAsForwards: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // outboundEmailsFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // outboundEmailsDelivered: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // outboundEmailsRead: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // outboundEmailsByAgent: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textOutboundComments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textOutboundCommentsSent: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textOutboundCommentsFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textNegativeSentimentsOutbound: {
      //   type: DataTypes.INTEGER, // done here till
      //   defaultValue: 0
      // },
      // textNeutralSentimentsOutbound: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textPositiveSentimentsOutbound: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaOutboundComments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaOutboundCommentsSent: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaOutboundCommentsFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaNegativeSentimentsOutbound: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaNeutralSentimentsOutbound: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaPositiveSentimentsOutbound: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textCannedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textTemplateMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textMessagesFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textMessagesDelivered: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textMessagesRead: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textNegativeSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textNeutralSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textPositiveSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // textRedFlaggedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaCannedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaTemplateMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaMessagesFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaMessagesDelivered: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaMessagesRead: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaNegativeSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaNeutralSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaPositiveSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // multimediaRedFlaggedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveCannedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveTemplateMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveMessagesFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveMessagesDelivered: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveMessagesRead: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveNegativeSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveNeutralSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactivePositiveSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // interactiveRedFlaggedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateCannedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateTemplateMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateMessagesFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateMessagesDelivered: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateMessagesRead: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateNegativeSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateNeutralSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templatePositiveSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // templateRedFlaggedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonCannedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonTemplateMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonMessagesFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonMessagesDelivered: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonMessagesRead: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonNegativeSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonNeutralSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonPositiveSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // buttonRedFlaggedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderCannedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderTemplateMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderMessagesFailed: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderMessagesDelivered: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderMessagesRead: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderNegativeSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderNeutralSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderPositiveSentiments: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // },
      // orderRedFlaggedMessages: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0
      // }
    },
    {
      sequelize,
      tableName: 'yovo_tbl_agent_summary_stats_15_min',
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