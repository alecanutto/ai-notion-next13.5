import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const notes = pgTable('notes', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  imageUrl: text('imageUrl'),
  userId: text('user_id').notNull(),
  editorState: text('editor_state'),
})
