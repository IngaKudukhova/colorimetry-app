const express = require('express')

const router = express.Router()

const Analysis = require('../models/Analysis')

router.post('/', async (req, res) => {
  try {
    const analysis = new Analysis(req.body)

    await analysis.save()

    res.status(201).json({
      message: 'Analysis saved',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

module.exports = router
