const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  dashboardId: {
    type: Schema.Types.ObjectId,
    ref: 'biDashboard',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  visualizationType: {
    type: String,
    default: null
  },
  modelType: {
    type: String,
    default: null
  },
  columns: [String],
  filters: {
    type: Schema.Types.Mixed, // Flexible schema for any type of filters
    default: {}
  },
  queryString: {
    type: String,
    default: null
  },
  groupBy: {
    type: String,
    default: null
  },
  files: {
    type: [String],
    default: []
  },
  layout: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    w: { type: Number, default: 12 },
    h: { type: Number, default: 6 }
  },
  chartOptions: {
    type: { type: String, default: null }, // Chart type (bar, line, pie, etc.)
    showLegend: { type: Boolean, default: true },
    showDataLabels: { type: Boolean, default: false },
    horizontal: { type: Boolean, default: false },
    animate: { type: Boolean, default: true },
    // Additional chart configuration can be added here
    options: { type: Schema.Types.Mixed, default: {} }
  }
}, {
  timestamps: true
});

// Create indexes for optimized queries
SectionSchema.index({ dashboardId: 1 });

module.exports = mongoose.model('biSection', SectionSchema);