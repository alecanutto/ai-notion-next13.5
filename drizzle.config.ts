import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({
  path: '.env',
})

export default {
  driver: 'pg',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
