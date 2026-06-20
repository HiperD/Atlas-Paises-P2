import { pool } from '../config/db.js'

export async function findUserByUsername(username) {
  const result = await pool.query(
    'SELECT id, name, username, password_hash FROM users WHERE username = $1 LIMIT 1',
    [username],
  )

  return result.rows[0] || null
}

export async function createSecurityLog({ userId, eventType, success, details }) {
  await pool.query(
    `
      INSERT INTO security_logs (user_id, event_type, success, details)
      VALUES ($1, $2, $3, $4)
    `,
    [userId, eventType, success, details ? JSON.stringify(details) : null],
  )
}
