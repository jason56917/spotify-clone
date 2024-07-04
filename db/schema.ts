import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

// 使用drizzle的pgTable建立accounts資料表及欄位，並定義欄位類型和限制
export const songs = pgTable('songs', {
  id: text('id')
    .primaryKey(),
  createdAt: timestamp('created_at', { mode: 'date' })
    .notNull(),
  userId: text('user_id')
    .notNull(),
  title: text('title')
    .notNull(),
  album: text('album')
    .notNull(),
  songUrl: text('song_Url')
    .notNull(),
  imageUrl: text('image_Url')
    .notNull(),
})

export const likedSongs = pgTable('liked_songs', {
  id: text('id')
    .primaryKey(),
  userId: text('user_id')
    .notNull(),
  songId: text('song_id')
    .references(() => songs.id, {
      onDelete: 'cascade',
    })
    .notNull(),
})

// 建立一對多關係，一個likedSongs可以有多個songs
export const songsRelations = relations(songs, ({ many }) => ({
  likedSongs: many(likedSongs),
}))

export const likedSongsRelations = relations(likedSongs, ({ one }) => ({
  songs: one(songs, {
    fields: [likedSongs.songId],
    references: [songs.id],
  }),
}))

// 建立zod驗證規範: 當要新增資料時，zod會確保資料符合欄位類型和限制
// 驗證機制似乎沒有生效，就算欄位空白也能通過
export const insertSongSchema = createInsertSchema(songs, {
  createdAt: z.coerce.date(),
})
export const insertLikedSongSchema = createInsertSchema(likedSongs)

export type SongType = typeof songs.$inferInsert
export type LikedSongType = typeof likedSongs.$inferInsert