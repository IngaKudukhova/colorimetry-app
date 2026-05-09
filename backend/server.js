require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const substanceRoutes = require('./routes/substanceRoutes')

const analysisRoutes = require('./routes/analysisRoutes')

const app = express()

app.use(cors())

app.use(express.json())

const PORT = 3000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.log(error)
  })

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
  })
})

app.use('/substances', substanceRoutes)

app.use('/analyses', analysisRoutes)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
