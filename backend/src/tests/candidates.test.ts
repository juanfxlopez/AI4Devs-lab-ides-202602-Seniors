import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import { app } from '../index'

const prisma = new PrismaClient()

describe('Candidates API', () => {
  beforeAll(async () => {
    await prisma.candidate.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  test('creates candidate without CV', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Alice')
      .field('lastName', 'Doe')
      .field('email', 'alice@example.com')
      .field('education', JSON.stringify([]))
      .field('workExperience', JSON.stringify([]))

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      firstName: 'Alice',
      lastName: 'Doe',
      email: 'alice@example.com'
    })
  })

  test('returns 400 on missing required fields', async () => {
    const res = await request(app).post('/api/candidates').send({})

    expect(res.status).toBe(400)
    expect(res.body.errors).toHaveProperty('firstName')
    expect(res.body.errors).toHaveProperty('lastName')
    expect(res.body.errors).toHaveProperty('email')
  })

  test('returns 400 on invalid email format', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Bob')
      .field('lastName', 'Smith')
      .field('email', 'not-an-email')

    expect(res.status).toBe(400)
    expect(res.body.errors.email).toBeDefined()
  })

  test('returns 400 when education JSON is invalid', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Carol')
      .field('lastName', 'Doe')
      .field('email', 'carol@example.com')
      .field('education', 'not-json')

    expect(res.status).toBe(400)
    expect(res.body.errors.education).toBeDefined()
  })

  test('returns 409 on duplicate email', async () => {
    const email = 'dup@example.com'

    await request(app)
      .post('/api/candidates')
      .field('firstName', 'Dan')
      .field('lastName', 'Doe')
      .field('email', email)
      .field('education', JSON.stringify([]))
      .field('workExperience', JSON.stringify([]))

    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Dan2')
      .field('lastName', 'Doe2')
      .field('email', email)
      .field('education', JSON.stringify([]))
      .field('workExperience', JSON.stringify([]))

    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/already exists/i)
  })

  test('returns 400 on invalid CV file type', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Eve')
      .field('lastName', 'Doe')
      .field('email', 'eve@example.com')
      .field('education', JSON.stringify([]))
      .field('workExperience', JSON.stringify([]))
      .attach('cvFile', Buffer.from('not pdf'), {
        filename: 'cv.txt',
        contentType: 'text/plain'
      })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/Only PDF and DOCX/i)
  })

  test('education suggestions endpoint returns array', async () => {
    const res = await request(app).get(
      '/api/candidates/education/suggestions?q=uni'
    )

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.suggestions)).toBe(true)
  })

  test('experience suggestions endpoint returns array', async () => {
    const res = await request(app).get(
      '/api/candidates/experience/suggestions?q=company'
    )

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.suggestions)).toBe(true)
  })
})

