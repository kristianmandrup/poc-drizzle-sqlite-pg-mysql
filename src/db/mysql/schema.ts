import { relations, sql } from 'drizzle-orm';
import { datetime, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
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
  builder.indexFor(['first_name', 'last_name', 'email'])
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
    userId: int('user_id').references(() => usersTable.id, {
      onDelete: 'cascade'
    }),
    title: varchar('title', { length: 255 }),
    content: varchar('content', { length: 255 }),
    createdAt: datetime('created_at', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`)
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
