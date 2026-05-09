require('dotenv').config()

const mongoose = require('mongoose')

const Substance = require('../models/Substance')

const substances = require('./substances')

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected')

    await Substance.deleteMany()

    await Substance.insertMany(substances)

    console.log('Substances added')

    process.exit()
  })
  .catch((error) => {
    console.log(error)
  })
