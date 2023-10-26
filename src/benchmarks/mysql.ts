import { sql } from 'drizzle-orm';
import { mysqlClient } from '~/db/client';
import { usersTable } from '~/db/mysql/schema';

const mysqlDbClient = mysqlClient();

async function runBenchmark() {
  console.log('MySQL Benchmarking...');
  const start = performance.now();
  const records = await mysqlDbClient
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(usersTable);
  const end = performance.now();
  console.log(`Total records of ${records[0]?.count.toLocaleString('en-US')}`);
  console.log(`Execution Time: ${end - start} ms`);
}

void runBenchmark();
