import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { SQLiteSchemaBuilder, Time } from '../helpers/sqlite';

export const usersTable = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey().notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    email: text('email'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
  },
  table => {
    return {
      firstNameIdx: index('users_first_name_idx').on(table.firstName),
      lastNameIdx: index('users_last_name_idx').on(table.lastName),
      emailIdx: index('users_email_idx').on(table.email),
      createdAtIdx: index('users_created_at_idx').on(table.createdAt)
    };
  }
);

export type User = typeof usersTable.$inferSelect;
export type CreateUser = typeof usersTable.$inferInsert;

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable)
}));

const builder = new SQLiteSchemaBuilder('user');

export const postsTable = sqliteTable(
  'posts',
  {
    id: builder.primary(),
    userId: builder.relation(usersTable),
    title: builder.str('title'),
    content: builder.str('content'),
    createdAt: builder.timeDate('created_at', { default: Time.Now })
  },
  builder.indexFor(['id', 'user_id', 'title', 'content'])
);

export type Post = typeof postsTable.$inferSelect;
export type CreatePost = typeof postsTable.$inferInsert;

export const postsRelations = relations(postsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id]
  })
}));
