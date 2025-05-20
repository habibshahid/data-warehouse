const mongoose = require('mongoose');

const agentJournalSchema = new mongoose.Schema({
    sessionId: {
      type: String,
    },
    agentId: {
      type: Number,
    },
    queueId: {
      type: String,
    },
    queue: {
      type: String,
      index: true
    },
    agent: {
      type: String,
      index: true
    },
    event: {
      type: String,
      index: true
    },
    medium: { // this key used only in ONINTERACTION event to answer how the agent become part of this interaction like transfer,
      // share etc
      type: String
    },
    breakId: {
      type: Number,
    },
    data: {
      type: String,
    },
    data1: {
      type: String,
    },
    startDateTime: {
      type: String,
      index: true
    },
    endDateTime: {
      type: String,
      index: true
    },
    duration: {
      type: Number,
      default: 0
    },
    channel: {
      type: String,
      index: true
    },
    createdAt: {
      type: Date,
      index: true
    },
    agentFullName: {
      type: String
    }
  }, {
    timestamps: true
  }
);

agentJournalSchema.index({ agent: 1, });
agentJournalSchema.index({ queue: 1 });
agentJournalSchema.index({ event: 1, });
agentJournalSchema.index({ endDatetime: 1 });
agentJournalSchema.index({ startDatetime: 1 });
agentJournalSchema.index({ channel: 1 });

agentJournalSchema.index({ agent: -1, });
agentJournalSchema.index({ queue: -1 });
agentJournalSchema.index({ event: -1, });
agentJournalSchema.index({ endDatetime: -1 });
agentJournalSchema.index({ startDatetime: -1 });
agentJournalSchema.index({ channel: -1 });

const AgentJournal = mongoose.model('agentJournal', agentJournalSchema);

module.exports = AgentJournal;
