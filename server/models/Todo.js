const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String },
  date: { type: Date },
  time: { type: String },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);
