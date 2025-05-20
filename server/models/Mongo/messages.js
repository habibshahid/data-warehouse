const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
  interactionId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  channelMessageId: {
    type: String,
    default: null
  },
  message: {
    type: String,
    default: null
  },
  messageType: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  author: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: null
    },
    role: {
      type: String,
      required: true
    }
  },
  direction: {
    type: Number,
    required: true
  },
  readBy: {
    type: Array,
    default: []
  },
  forwarded: {
    type: Boolean,
    default: false
  },
  isChild: {
    type: Boolean,
    default: false

  },
  parentId: {
    type: String,
    default: null
  },
  status: {
    message: {
      type: String,
      default: null
    },
    remarks: {
      type: String,
      default: null
    },
    error: {
      statusCode: {
        type: Number,
        default: null
      },
      statusText: {
        type: String,
        default: null
      }
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  attachments: [{
    _id: false,
    type: { type: String },
    data: { type: Object }
  }],
  extraPayload: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});


const Message = mongoose.model('messages', messageSchema);
module.exports = Message;