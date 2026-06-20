import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { createSecurityLog, findUserByUsername } from '../models/userModel.js'

const router = Router()

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Informe o usuario.'),
    body('password').trim().notEmpty().withMessage('Informe a senha.'),
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
      const { username, password } = request.body
      const user = await findUserByUsername(username)

      if (!user) {
        await createSecurityLog({
          userId: null,
          eventType: 'login',
          success: false,
          details: { username },
        })

        return response.status(401).json({ message: 'Usuario ou senha invalidos.' })
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash)

      if (!passwordMatch) {
        await createSecurityLog({
          userId: user.id,
          eventType: 'login',
          success: false,
          details: { username },
        })

        return response.status(401).json({ message: 'Usuario ou senha invalidos.' })
      }

      const token = jwt.sign(
        { sub: user.id, name: user.name, username: user.username },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn },
      )

      await createSecurityLog({
        userId: user.id,
        eventType: 'login',
        success: true,
        details: { username },
      })

      return response.json({
        message: 'Login realizado com sucesso.',
        token,
        user: { id: user.id, name: user.name, username: user.username },
      })
    } catch (error) {
      return response.status(500).json({ message: 'Erro ao autenticar usuario.' })
    }
  },
)

export default router
