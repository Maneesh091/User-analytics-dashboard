const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

     session_id:  { type: String, required: true },
  type:        { type: String, enum: ['page_view', 'click'], required: true },
  page_url:    { type: String, required: true },
  timestamp:   { type: Date, required: true },
  x:           Number,   // sirf click ke liye
  y:           Number,   // sirf click ke liye
  page_width:  Number,   // heatmap scale karne ke liye
  page_height: Number,
});

// Indexes = queries fast. README me ye zaroor mention karna.
eventSchema.index({ session_id: 1, timestamp: 1 }); // session ke events
eventSchema.index({ page_url: 1, type: 1 });        // heatmap query

module.exports = mongoose.model('Event', eventSchema);