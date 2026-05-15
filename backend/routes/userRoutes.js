const authMiddleware = require('../middleware/authMiddleware')

const roleMiddleware = require('../middleware/roleMiddleware')

const express = require('express')

const router = express.Router()

const User = require('../models/User')

const bcrypt = require('bcryptjs')

router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find()

    res.json(users)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { username, password, role } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      username,

      password: hashedPassword,

      role,
    })

    await user.save()

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),

  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        })
      }

      if (user.role === 'admin') {
        const adminCount = await User.countDocuments({
          role: 'admin',
        })

        if (adminCount === 1) {
          return res.status(400).json({
            message: 'Cannot delete last admin',
          })
        }
      }

      await User.findByIdAndDelete(req.params.id)

      res.json({
        message: 'User deleted',
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
)

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),

  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        })
      }

      if (user.role === 'admin' && req.body.role !== 'admin') {
        const adminCount = await User.countDocuments({
          role: 'admin',
        })

        if (adminCount === 1) {
          return res.status(400).json({
            message: 'Cannot change role of last admin',
          })
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,

        {
          role: req.body.role,
        },

        {
          new: true,
        },
      )

      res.json(updatedUser)
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
)

module.exports = router
