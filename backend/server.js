require('dotenv').config()

const userRoutes = require('./routes/userRoutes')

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const substanceRoutes = require('./routes/substanceRoutes')
const analysisRoutes = require('./routes/analysisRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(cors())

app.use(express.json())

const PORT = 3000

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
  })
})

app.use('/substances', substanceRoutes)

app.use('/analyses', analysisRoutes)

app.use('/users', userRoutes)

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connected')

    app.use('/auth', authRoutes)

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()
