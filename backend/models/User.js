const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['admin', 'lab_assistant'],
    default: 'lab_assistant',
  },
})

module.exports = mongoose.model('User', userSchema)
