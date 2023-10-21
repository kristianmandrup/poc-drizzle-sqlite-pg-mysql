import type { Config } from 'drizzle-kit';
import { envConfig } from './env.config';
import { generateDbString } from './src/utils/generate-db-string';

export default {
  schema: './src/db/mysql/schema.ts',
  out: './drizzle/migrations/mysql',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: generateDbString({
      dbType: 'mysql',
      options: {
        user: envConfig.DB_USER,
        password: envConfig.DB_PASSWORD,
        host: envConfig.DB_HOST,
        port: envConfig.DB_MYSQL_PORT,
        database: envConfig.DB_NAME,
      },
    }),
  },
  strict: true,

  /* For debugging purposes */
  verbose: true,
} satisfies Config;
