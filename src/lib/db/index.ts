import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

neonConfig.fetchConnectionCache = true

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql)

migrate(db, { migrationsFolder: 'drizzle' })
