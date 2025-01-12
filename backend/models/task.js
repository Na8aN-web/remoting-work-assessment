const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do'
  },
  dueDate: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);