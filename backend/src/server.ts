import app from './index'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const port = 3010

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'LTI Talent Tracking API',
    version: '1.0.0',
    description: 'API for managing candidates in the LTI Talent Tracking System'
  },
  servers: [
    {
      url: `http://localhost:${port}`
    }
  ]
}

const swaggerOptions = {
  swaggerDefinition,
  apis: []
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`)
})

