import { relations, sql } from 'drizzle-orm';
import { index, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
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
  builder.indexFor(['first_name', 'last_name', 'email'])
);

export type User = typeof usersTable.$inferSelect;
export type CreateUser = typeof usersTable.$inferInsert;

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable)
}));

export const postsTable = pgTable(
  'posts',
  {
    id: serial('id').primaryKey().notNull(),
    userId: serial('user_id').references(() => usersTable.id, {
      onDelete: 'cascade'
    }),
    title: varchar('title', { length: 255 }),
    content: varchar('content', { length: 255 }),
    createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).default(sql`NOW()`)
  },
  table => ({
    userIdIdx: index('posts_user_id_idx').on(table.userId),
    titleIdx: index('posts_title_idx').on(table.title),
    contentIdx: index('posts_content_idx').on(table.content),
    createdAtIdx: index('posts_created_at_idx').on(table.createdAt)
  })
);

export type Post = typeof postsTable.$inferSelect;
export type CreatePost = typeof postsTable.$inferInsert;

export const postsRelations = relations(postsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id]
  })
}));
