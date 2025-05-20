const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  caller: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    pictureURL: {
      type: String,
      default: null
    }
  },
  participants: [{
    _id: false,
    id: { type: String },
    name: { type: String },
    role: { type: String },
    joinDtTime: { type: String, default: '0000-00-00 00:00:00' },
    leaveDtTime: { type: String, default: '0000-00-00 00:00:00' },
    isAdmin: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    callParams: { type: Object },
    mute: { type: Boolean },
    inCall: { type: Boolean },
    firstResponseTime: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 }
  }],
  extension: {
    type: String,
    required: true
  },
  postId: {   // it will only show up in comment type interactions
    type: String,
  },
  hold: { // only used in call channel
    status: {
      type: Boolean,
      default: false
    },
    details: [{
      _id: false,
      holderId: {
        type: String
      },
      holderName: {
        type: String
      },
      startDtTime: {
        type: String,
        default: '0000-00-00 00:00:00'
      },
      endDtTime: {
        type: String,
        default: '0000-00-00 00:00:00'
      }
    }]
  },
  queue: {
    inQueue: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    startDtTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    endDtTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    duration: {
      type: Number,
      default: 0
    },
  },
  pageQueue: {
    type: String,
    default: null
  },
  channelQueue: {
    type: String,
    default: null
  },
  bot: {
    active: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    hangup: {
      type: Boolean,
      default: true
    },
    startDtTime: {
      type: String,
      default: '0000-00-00 00:00:00',
    },
    endDtTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    duration: {
      type: Number,
      default: 0
    },
  },
  connect: {
    active: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    },
    startDtTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    endDtTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    duration: {
      type: Number,
      default: 0
    },
  },
  wrapUp: {
    status: {
      type: Boolean,
      default: false
    },
    startDtTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    endDtTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    wrapUpTime: {
      type: Number,
      default: 0
    },
  },
  direction: {
    type: Number,
    default: 0
  },
  ringTime: {
    type: Number,
    default: 0
  },
  transfer: {
    status: {
      type: Boolean,
      default: false
    },
    details: [{
      _id: false,
      type: {
        type: String
      },
      from: {
        type: Object
      },
      to: {
        type: Object
      },
      startDtTime: {
        type: String,
        default: '0000-00-00 00:00:00'
      },
      endDtTime: {
        type: String,
        default: '0000-00-00 00:00:00'
      },
      success: {
        type: Boolean
      },
      reason: {
        type: String
      }
    }]
  },
  shared: {
    status: {
      type: Boolean,
      default: false
    },
    details: [{
      _id: false,
      from: {
        type: Object
      },
      to: {
        type: Object
      },
      startDtTime: {
        type: String,
        default: '0000-00-00 00:00:00'
      },
      endDtTime: {
        type: String,
        default: '0000-00-00 00:00:00'
      },
      success: {
        type: Boolean
      },
      reason: {
        type: String
      }
    }]
  },
  firstResponseTime: {
    type: Number,
    default: 0
  },
  averageResponseTime: {
    type: Number,
    default: 0
  },
  abandoned: {
    status: {
      type: Boolean,
      default: false
    },
    dtTime: {
      type: String,
      default: '0000-00-00 00:00:00'
    },
    reason: {
      type: String,
      default: ''
    }
  },
  completeByCaller: {
    type: Boolean,
    default: false
  },
  completeByAgent: {
    type: Boolean,
    default: false
  },
  completedDtTime: {
    type: String,
    default: '0000-00-00 00:00:00'
  },
  workCodes: [{
    _id: false,
    id: {
      type: String
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String
    }
  }],
  campaign: {
    id: {
      type: Number,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  contact: {
    type: Object,
    default: null
  },
  created: {
    year: {
      type: String
    },
    month: {
      type: String
    },
    day: {
      type: String
    },
    hour: {
      type: String
    },
    minutes: {
      type: String
    }
  },
  status: {
    type: Boolean,
    default: true
  },
  reopenLogs: {
    status: {
      type: Boolean,
      default: false
    },
    details: [{
      _id: false,
      openBy: {
        type: String,
        required: true
      },
      closeBy: {
        type: String,
        default: null
      },
      openDtTime: {
        type: String,
        required: true
      },
      closeDtTime: {
        type: String,
        default: '0000-00-00 00:00:00'
      }
    }]
  },
  notes: {
    type: String,
    default: null
  },
  channel: {
    type: String,
    required: true
  },
  taskRouter: {
    type: Boolean,
    default: false
  },
  lastMessage: {
    type: Object,
    default: {}
  },
  extraPayload: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
})


const Interaction = mongoose.model('interactions', interactionSchema);
module.exports = Interaction;