const express = require('express')

const router = express.Router()

const Substance = require('../models/Substance')

router.get('/', async (req, res) => {
  try {
    const substances = await Substance.find()

    res.json(substances)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

module.exports = router
