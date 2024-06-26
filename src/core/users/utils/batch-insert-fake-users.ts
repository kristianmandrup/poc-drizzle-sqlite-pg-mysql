import { mysqlUserService, pgUserService, sqliteUserService } from '../user-service';
import { makeFakeUsers } from './make-fake-users';

export type BatchInsertFakeUsersOptions = {
  batchCount: number;
  batchSize: number;
  dbType: 'pg' | 'mysql' | 'sqlite';
};

export async function batchInsertFakeUsers({
  dbType,
  batchCount,
  batchSize
}: BatchInsertFakeUsersOptions) {
  const totalBatches = Math.ceil(batchCount / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const users = makeFakeUsers(batchSize);

    const insertStrategy = {
      sqlite: sqliteUserService,
      pg: pgUserService,
      mysql: mysqlUserService
    };

    await insertStrategy[dbType]().insertMany({ values: users });

    const databaseName = {
      sqlite: 'SQLite',
      pg: 'PostgreSQL',
      mysql: 'MySQL'
    }[dbType];

    console.log(`${databaseName} | Total records inserted ${users.length.toLocaleString('en-US')}`);
  }
}
