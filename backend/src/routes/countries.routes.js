import { Router } from 'express'
import { body, query, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { createCountry, searchCountries } from '../models/countryModel.js'
import { createSecurityLog } from '../models/userModel.js'

const router = Router()

function authenticate(request, response, next) {
  const authorization = request.headers.authorization || ''

  if (!authorization.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Token ausente.' })
  }

  const token = authorization.slice(7)

  try {
    request.user = jwt.verify(token, env.jwtSecret)
    return next()
  } catch (error) {
    return response.status(401).json({ message: 'Token invalido ou expirado.' })
  }
}

router.get(
  '/',
  authenticate,
  [
    query('search').optional().isString().trim(),
    query('region').optional().isString().trim(),
  ],
  async (request, response) => {
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({
        message: 'Parametros invalidos.',
        errors: validation.array(),
      })
    }

    try {
      const countries = await searchCountries({
        term: request.query.search || '',
        region: request.query.region || 'all',
      })

      await createSecurityLog({
        userId: request.user?.sub || null,
        eventType: 'search',
        success: true,
        details: { search: request.query.search || '', region: request.query.region || 'all' },
      })

      return response.json({ countries })
    } catch (error) {
      return response.status(500).json({ message: 'Erro ao buscar paises.' })
    }
  },
)

router.post(
  '/',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Informe o nome.'),
    body('cca3').trim().notEmpty().withMessage('Informe o codigo CCA3.'),
    body('region').trim().notEmpty().withMessage('Informe a regiao.'),
    body('population').isInt({ min: 0 }).withMessage('Populacao invalida.'),
    body('area').isFloat({ min: 0 }).withMessage('Area invalida.'),
    body('flagUrl').isURL().withMessage('URL da bandeira invalida.'),
  ],
  async (request, response) => {
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({
        message: 'Campos invalidos.',
        errors: validation.array(),
      })
    }

    try {
      const createdCountry = await createCountry({
        name: request.body.name,
        cca3: request.body.cca3,
        capital: request.body.capital || null,
        region: request.body.region,
        population: Number(request.body.population),
        area: Number(request.body.area),
        flagUrl: request.body.flagUrl,
      })

      await createSecurityLog({
        userId: request.user?.sub || null,
        eventType: 'insert',
        success: true,
        details: { cca3: createdCountry.cca3, name: createdCountry.name },
      })

      return response.status(201).json({
        message: 'Pais inserido com sucesso.',
        country: createdCountry,
      })
    } catch (error) {
      return response.status(500).json({ message: 'Erro ao inserir pais.' })
    }
  },
)

export default router
