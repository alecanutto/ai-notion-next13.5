import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core'

export const $notes = pgTable('notes', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  imageUrl: text('imageUrl'),
  userId: text('user_id').notNull(),
  editorState: text('editor_state'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

export type NoteType = typeof $notes.$inferInsert

// drizzle-orm
// drizzle-kit
