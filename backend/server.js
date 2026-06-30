// require('dotenv').config()

// const userRoutes = require('./routes/userRoutes')

// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')

// const substanceRoutes = require('./routes/substanceRoutes')
// const analysisRoutes = require('./routes/analysisRoutes')
// const authRoutes = require('./routes/authRoutes')
// const mlRoutes = require('./routes/ml')

// const app = express()

// app.use(cors())

// app.use(express.json())

// const PORT = 3000

// app.get('/health', (req, res) => {
//   res.json({
//     status: 'OK',
//   })
// })

// app.use('/substances', substanceRoutes)

// app.use('/analyses', analysisRoutes)

// app.use('/users', userRoutes)

// app.use('/ml', mlRoutes)

// async function startServer() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI)

//     console.log('MongoDB connected')

//     app.use('/auth', authRoutes)

//     app.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`)
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

// startServer()
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const substanceRoutes = require('./routes/substanceRoutes')
const analysisRoutes = require('./routes/analysisRoutes')
const authRoutes = require('./routes/authRoutes')
const mlRoutes = require('./routes/ml')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.use('/substances', substanceRoutes)
app.use('/analyses', analysisRoutes)
app.use('/users', userRoutes)
app.use('/ml', mlRoutes)
app.use('/auth', authRoutes)

// Экспортируем app для тестов
module.exports = app

// Запускаем сервер только если файл запущен напрямую, не через тесты
if (require.main === module) {
  async function startServer() {
    try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('MongoDB connected')
      app.listen(3000, () => {
        console.log('Server started on port 3000')
      })
    } catch (error) {
      console.log(error)
    }
  }
  startServer()
}
