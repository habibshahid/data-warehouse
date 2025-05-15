const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DashboardSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: null
  },
  category: {
    type: String,
    trim: true,
    default: null
  },
  favorite: {
    type: Boolean,
    default: false
  },
  ownerId: {
    type: String,
    required: true
  },
  owner: {
    type: Object,
    required: true
  },
  extraPayload: {
    type: Object,
    default: null
  }
}, {
  timestamps: true
});

// Create indexes for optimized queries
DashboardSchema.index({ ownerId: 1, favorite: 1 });

module.exports = mongoose.model('biDashboard', DashboardSchema);