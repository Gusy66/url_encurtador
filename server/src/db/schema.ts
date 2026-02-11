import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  clicks: integer('clicks').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastClickedAt: timestamp('last_clicked_at')
})
