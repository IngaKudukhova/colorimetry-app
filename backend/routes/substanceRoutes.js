const express = require('express')

const router = express.Router()

const Substance = require('../models/Substance')

const authMiddleware = require('../middleware/authMiddleware')

const roleMiddleware = require('../middleware/roleMiddleware')

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

router.post('/', async (req, res) => {
  try {
    const substance = new Substance(req.body)

    await substance.save()

    res.status(201).json(substance)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Substance.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Substance deleted',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

module.exports = router
