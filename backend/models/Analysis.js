const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema({
  substance: {
    type: String,
    required: true,
  },

  rgb1: {
    r: Number,
    g: Number,
    b: Number,
  },

  rgb2: {
    r: Number,
    g: Number,
    b: Number,
  },

  area: Number,

  perimeter: Number,

  concentrationArea: Number,

  concentrationPerimeter: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Analysis', analysisSchema)
