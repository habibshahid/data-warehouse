const mongoose = require('mongoose');

const presenceJournalSchema = new mongoose.Schema({
    agentId: {
      type: Number,
      required: true
    },
    agentName: {
      type: String,
      required: true
    },
    agent: {
      type: String,
      default: function () {
        return `SIP/${ this.agentName }`
      }
    },
    event: {
      type: String,
      required: true
    },
    breakId: {
      type: Number,
    },
    breakName: {
      type: String,
    },
    startDateTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    endDateTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    duration: {
      type: Number,
      default: 0
    },
    extraPayload: {
      type: Object,
      default: {}
    },
    agentFullName: {
      type: String
    }
  }, {
    timestamps: true
  }
);

const PresenceJournal = mongoose.model('presenceJournal', presenceJournalSchema);

module.exports = PresenceJournal;
