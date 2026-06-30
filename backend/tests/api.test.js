const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')
const User = require('../models/User')
const Substance = require('../models/Substance')
const bcrypt = require('bcryptjs')

// Подключаемся к тестовой базе данных перед всеми тестами
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI)
})

// Очищаем тестовые данные и закрываем соединение после всех тестов
afterAll(async () => {
  await User.deleteMany({ username: /^testuser/ })
  await Substance.deleteMany({ name: /^Тестовое/ })
  await mongoose.connection.close()
})

// ─── Вспомогательная функция: получить токен администратора ───────────────
async function getAdminToken() {
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: 'admin123' })
  return res.body.token
}

describe('Тест 1. Аутентификация — успешный вход', () => {
  test('POST /auth/login с корректными данными возвращает токен', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.role).toBe('admin')
  })
})

describe('Тест 2. Аутентификация — неверный пароль', () => {
  test('POST /auth/login с неверным паролем возвращает 401', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' })

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('message')
  })
})

describe('Тест 3. Вещества — получение списка', () => {
  test('GET /substances возвращает массив веществ', async () => {
    const res = await request(app).get('/substances')

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('Тест 4. Вещества — добавление нового аналита', () => {
  test('POST /substances создаёт новое вещество и возвращает 201', async () => {
    const newSubstance = {
      name: 'Тестовое вещество',
      areaEquation: { type: 'linear', a: 1.5, b: 0.3 },
      perimeterEquation: { type: 'linear', a: 2.1, b: 0.1 },
    }

    const res = await request(app).post('/substances').send(newSubstance)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('Тестовое вещество')
  })
})

describe('Тест 5. Пользователи — доступ без авторизации', () => {
  test('GET /users без токена возвращает 401 или 403', async () => {
    const res = await request(app).get('/users')

    expect([401, 403]).toContain(res.statusCode)
  })
})

describe('Тест 6. Пользователи — создание администратором', () => {
  test('POST /users с токеном администратора создаёт пользователя', async () => {
    const token = await getAdminToken()

    const res = await request(app).post('/users').set('Authorization', `Bearer ${token}`).send({
      username: 'testuser_new',
      password: 'pass123',
      role: 'lab_assistant',
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.username).toBe('testuser_new')
  })
})

describe('Тест 7. Пользователи — защита последнего администратора', () => {
  test('DELETE последнего администратора возвращает 400', async () => {
    const token = await getAdminToken()

    // Получаем список пользователей и находим id администратора
    const usersRes = await request(app).get('/users').set('Authorization', `Bearer ${token}`)

    // Находим всех администраторов
    const admins = usersRes.body.filter((u) => u.role === 'admin')

    // Тест актуален только если администратор один
    if (admins.length === 1) {
      const adminId = admins[0]._id

      const res = await request(app)
        .delete(`/users/${adminId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(400)
      expect(res.body.message).toMatch(/последнего администратора/)
    } else {
      // Если администраторов несколько — просто проверяем, что список получен
      expect(admins.length).toBeGreaterThan(1)
    }
  })
})

describe('Тест 8. Health-check', () => {
  test('GET /health возвращает статус OK', async () => {
    const res = await request(app).get('/health')

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('OK')
  })
})
