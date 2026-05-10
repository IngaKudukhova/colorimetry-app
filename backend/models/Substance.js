const mongoose = require('mongoose')

const equationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['linear', 'power', 'polynomial', 'exponential'],
    required: true,
  },

  a: Number,

  b: Number,

  c: Number,

  r2: Number,
})

const substanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  areaEquation: equationSchema,

  perimeterEquation: equationSchema,
})

module.exports = mongoose.model('Substance', substanceSchema)
