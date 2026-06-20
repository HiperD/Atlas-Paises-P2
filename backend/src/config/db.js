import { Pool } from 'pg'
import { env } from './env.js'

if (!env.databaseUrl) {
  console.warn('DATABASE_URL nao configurada. As rotas de banco vao falhar ate definir a conexao.')
}

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl:
    process.env.PGSSLMODE === 'require'
      ? { rejectUnauthorized: false }
      : undefined,
})

export async function pingDatabase() {
  const result = await pool.query('SELECT NOW() AS now')
  return result.rows[0]
}
