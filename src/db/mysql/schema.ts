import { relations } from 'drizzle-orm';
import { mysqlTable } from 'drizzle-orm/mysql-core';
import { MySqlSchemaBuilder, Time } from '../helpers/mysql';

const builder = new MySqlSchemaBuilder('user');

export const usersTable = mysqlTable(
  'users',
  {
    id: builder.primary(),
    firstName: builder.str('first_name'),
    lastName: builder.str('last_name'),
    email: builder.str('email'),
    createdAt: builder.timeDate('created_at', { default: Time.Now })
  },
  builder.indexFor('first_name', 'last_name', 'email')
);

export type User = typeof usersTable.$inferSelect;
export type CreateUser = typeof usersTable.$inferInsert;

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable)
}));

export const postsTable = mysqlTable(
  'posts',
  {
    id: builder.primary(),
    userId: builder.relation(usersTable),
    title: builder.str('title'),
    content: builder.str('content'),
    createdAt: builder.timeDate('created_at', { default: Time.Now })
  },
  builder.indexFor('first_name', 'user_id', 'title', 'content')
);

export type Post = typeof postsTable.$inferSelect;
export type CreatePost = typeof postsTable.$inferInsert;

export const postsRelations = relations(postsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id]
  })
}));
