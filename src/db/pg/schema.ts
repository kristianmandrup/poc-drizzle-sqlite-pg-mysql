import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { PgSchemaBuilder, Time } from '../helpers/pg';

const builder = new PgSchemaBuilder('user');

export const usersTable = pgTable(
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

export const postsTable = pgTable(
  'posts',
  {
    id: builder.primary(),
    userId: builder.relation(usersTable),
    title: builder.str('title'),
    content: builder.str('content'),
    createdAt: builder.timeDate('created_at', { default: Time.Now })
  },
  builder.indexFor('user_id', 'title', 'content')
);

export type Post = typeof postsTable.$inferSelect;
export type CreatePost = typeof postsTable.$inferInsert;

export const postsRelations = builder.oneToMany(usersTable, postsTable);
