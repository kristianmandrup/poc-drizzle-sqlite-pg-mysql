import type { Config } from 'drizzle-kit';
import { makeDbString } from '~/db/utils/make-db-string';
import { envConfig } from '~/env';

const connectionString = makeDbString({
  dbType: 'pg',
  option: {
    user: envConfig.PG_DB_USER,
    password: envConfig.PG_DB_PASSWORD,
    host: envConfig.PG_DB_HOST,
    port: envConfig.PG_DB_PORT,
    database: envConfig.PG_DB_NAME
  }
});

console.log({ connectionString });

export default {
  schema: './src/db/pg/schema.ts',
  out: './drizzle/migrations/pg',
  driver: 'pg',
  dbCredentials: {
    connectionString
  },
  strict: true,

  /* For debugging purposes */
  verbose: true
} satisfies Config;
