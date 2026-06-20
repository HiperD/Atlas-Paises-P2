import { pool } from '../config/db.js'

export async function searchCountries({ term = '', region = 'all' }) {
  const filters = []
  const values = []

  if (term.trim()) {
    values.push(`%${term.trim().toLowerCase()}%`)
    filters.push(`LOWER(name) LIKE $${values.length}`)
  }

  if (region !== 'all') {
    values.push(region)
    filters.push(`region = $${values.length}`)
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''

  const result = await pool.query(
    `
      SELECT id, name, cca3, capital, region, population, area, flag_url, inserted_at
      FROM countries
      ${whereClause}
      ORDER BY name ASC
    `,
    values,
  )

  return result.rows
}

export async function createCountry(country) {
  const result = await pool.query(
    `
      INSERT INTO countries (name, cca3, capital, region, population, area, flag_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, cca3, capital, region, population, area, flag_url, inserted_at
    `,
    [
      country.name,
      country.cca3,
      country.capital,
      country.region,
      country.population,
      country.area,
      country.flagUrl,
    ],
  )

  return result.rows[0]
}
