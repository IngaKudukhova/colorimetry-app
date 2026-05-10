const { calculateAnalysis } = require('../controllers/analysisController')

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

router.get('/', async (req, res) => {
  try {
    const analyses = await Analysis.find().sort({ createdAt: -1 })

    res.json(analyses)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Analysis deleted',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

router.post('/calculate', calculateAnalysis)

module.exports = router
