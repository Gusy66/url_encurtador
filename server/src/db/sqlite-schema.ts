import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const urls = sqliteTable('urls', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  clicks: integer('clicks').default(0).notNull(),
  createdAt: text('created_at').notNull(),
  lastClickedAt: text('last_clicked_at')
})
