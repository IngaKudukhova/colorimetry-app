require('dotenv').config()

const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

const User = require('../models/User')

const users = require('./users')

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected')

    await User.deleteMany()

    const hashedUsers = []

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10)

      hashedUsers.push({
        ...user,
        password: hashedPassword,
      })
    }

    await User.insertMany(hashedUsers)

    console.log('Users added')

    process.exit()
  })
  .catch((error) => {
    console.log(error)
  })
