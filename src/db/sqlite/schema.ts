import { relations } from 'drizzle-orm';
import { sqliteTable } from 'drizzle-orm/sqlite-core';
import { SQLiteSchemaBuilder, Time } from '../helpers/sqlite';

const builder = new SQLiteSchemaBuilder('user');

export const usersTable = sqliteTable(
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

export const postsTable = sqliteTable(
  'posts',
  {
    id: builder.primary(),
    userId: builder.relation(usersTable),
    title: builder.str('title'),
    content: builder.str('content'),
    createdAt: builder.timeDate('created_at', { default: Time.Now })
  },
  builder.indexFor('id', 'user_id', 'title', 'content')
);

export type Post = typeof postsTable.$inferSelect;
export type CreatePost = typeof postsTable.$inferInsert;

export const postsRelations = builder.oneToMany(usersTable, postsTable);
