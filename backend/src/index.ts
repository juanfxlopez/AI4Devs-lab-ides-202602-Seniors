import { Request, Response, NextFunction } from 'express'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import multer from 'multer'

dotenv.config()

const prisma = new PrismaClient()
export const app = express()

const uploadsDir = path.join(__dirname, '..', 'uploads', 'cvs')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'))
      return
    }

    cb(null, true)
  }
})

app.use(express.json())

const port = 3010

app.get('/', (req, res) => {
  res.send('Hola LTI!')
})

app.post(
  '/api/candidates',
  upload.single('cvFile'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience
      } = req.body

      const errors: Record<string, string> = {}

      if (!firstName) errors.firstName = 'First name is required'
      if (!lastName) errors.lastName = 'Last name is required'
      if (!email) {
        errors.email = 'Email is required'
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          errors.email = 'Email format is invalid'
        }
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json({ errors })
        return
      }

      const existing = await prisma.candidate.findUnique({
        where: { email }
      })

      if (existing) {
        res.status(409).json({ message: 'Candidate with this email already exists' })
        return
      }

      let educationJson = null
      let workExperienceJson = null

      if (education) {
        try {
          educationJson = JSON.parse(education)
        } catch {
          errors.education = 'Education must be valid JSON'
        }
      }

      if (workExperience) {
        try {
          workExperienceJson = JSON.parse(workExperience)
        } catch {
          errors.workExperience = 'Work experience must be valid JSON'
        }
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json({ errors })
        return
      }

      let cvFilePath: string | null = null

      if (req.file) {
        cvFilePath = req.file.path
      }

      const candidate = await prisma.candidate.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || null,
          address: address || null,
          education: educationJson,
          workExperience: workExperienceJson,
          cvFilePath
        }
      })

      res.status(201).json({
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        address: candidate.address,
        createdAt: candidate.createdAt
      })
    } catch (err) {
      next(err)
    }
  }
)

app.get(
  '/api/candidates/education/suggestions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = (req.query.q as string) || ''
      const candidates = await prisma.candidate.findMany({
        select: { education: true }
      })

      const suggestions = new Set<string>()

      candidates.forEach(c => {
        if (c.education && Array.isArray(c.education)) {
          c.education.forEach((e: any) => {
            const values = [e.institution, e.degree, e.field].filter(Boolean)
            values.forEach((value: string) => {
              if (!q || value.toLowerCase().includes(q.toLowerCase())) {
                suggestions.add(value)
              }
            })
          })
        }
      })

      res.json({ suggestions: Array.from(suggestions) })
    } catch (err) {
      next(err)
    }
  }
)

app.get(
  '/api/candidates/experience/suggestions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = (req.query.q as string) || ''
      const candidates = await prisma.candidate.findMany({
        select: { workExperience: true }
      })

      const suggestions = new Set<string>()

      candidates.forEach(c => {
        if (c.workExperience && Array.isArray(c.workExperience)) {
          c.workExperience.forEach((e: any) => {
            const values = [e.company, e.role].filter(Boolean)
            values.forEach((value: string) => {
              if (!q || value.toLowerCase().includes(q.toLowerCase())) {
                suggestions.add(value)
              }
            })
          })
        }
      })

      res.json({ suggestions: Array.from(suggestions) })
    } catch (err) {
      next(err)
    }
  }
)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)

  if (err.message === 'Invalid file type') {
    res.status(400).json({ message: 'Only PDF and DOCX files are allowed for CV upload' })
    return
  }

  res.status(500).json({ message: 'Something went wrong. Please try again.' })
})

export default app
