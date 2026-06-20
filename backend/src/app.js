import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { env } from './config/env.js'
import authRoutes from './routes/auth.routes.js'
import countriesRoutes from './routes/countries.routes.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  }),
)
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.get('/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/countries', countriesRoutes)

app.use((request, response) => {
  response.status(404).json({ message: 'Rota nao encontrada.' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ message: 'Erro interno do servidor.' })
})

export default app
