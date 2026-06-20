import app from './app.js'
import { env } from './config/env.js'
import { pingDatabase } from './config/db.js'

async function bootstrap() {
  try {
    if (env.databaseUrl) {
      await pingDatabase()
      console.log('Conexao com PostgreSQL verificada.')
    }
  } catch (error) {
    console.warn('Nao foi possivel validar o banco na inicializacao.')
  }

  app.listen(env.port, () => {
    console.log(`Backend rodando em http://localhost:${env.port}`)
  })
}

bootstrap()
