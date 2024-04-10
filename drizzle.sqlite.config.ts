import type { Config } from 'drizzle-kit';
import { makeDbString } from '~/db/utils/make-db-string';
import { envConfig } from '~/env';

const url = makeDbString({ dbType: 'sqlite', option: { database: envConfig.SQLITE_DB_NAME } });

export default {
  schema: './src/db/sqlite/schema.ts',
  out: './drizzle/migrations/sqlite',
  driver: 'better-sqlite',
  dbCredentials: {
    url
  },
  strict: true,

  /* For debugging purposes */
  verbose: true
} satisfies Config;
