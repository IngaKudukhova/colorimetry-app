const express = require('express')

const router = express.Router()

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const User = require('../models/User')

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({
        message: 'Неверный логин',
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Неверный пароль',
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d',
      },
    )

    res.json({
      token,

      user: {
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

module.exports = router
