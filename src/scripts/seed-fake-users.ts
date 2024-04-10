import { batchInsertFakeUsers } from '~/core/users/utils/batch-insert-fake-users';
import { createMysqlClient, createPgClient, createSqliteClient } from '~/db/client';
import { usersTable as mysqlUsersTable } from '~/db/mysql/schema';
import { usersTable as pgUsersTable } from '~/db/pg/schema';
import { usersTable as sqliteUsersTable } from '~/db/sqlite/schema';

async function seedFakeUsers({
  dbType,
  batchCount,
  batchSize
}: {
  dbType: 'sqlite' | 'pg' | 'mysql';
  batchCount: number;
  batchSize: number;
}) {
  console.log('Cleaning up...');

  if (dbType === 'sqlite') {
    await createSqliteClient().delete(sqliteUsersTable);
  }

  if (dbType === 'pg') {
    await createPgClient().delete(pgUsersTable);
  }

  if (dbType === 'mysql') {
    await createMysqlClient().delete(mysqlUsersTable);
  }

  console.log(
    `Start seeding ${batchCount.toLocaleString(
      'en-US'
    )} records in batches of ${batchSize.toLocaleString('en-US')}`
  );

  const start = performance.now();
  await batchInsertFakeUsers({
    dbType,
    batchCount,
    batchSize
  });
  const end = performance.now();
  console.log(`Execution Time: ${end - start} ms`);
}

void seedFakeUsers({
  dbType: 'sqlite',
  batchCount: 100,
  batchSize: 50
});

// void seedFakeUsers({
//   dbType: 'pg',
//   batchCount: 1_000_000,
//   batchSize: 10_000,
// });

// void seedFakeUsers({
//   dbType: 'mysql',
//   batchCount: 1_000_000,
//   batchSize: 10_000,
// });
