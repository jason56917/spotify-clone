import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

// 使用drizzle的pgTable建立accounts資料表及欄位，並定義欄位類型和限制
export const songs = pgTable('songs', {
  // text(): 定義文字類型的欄位
  // primaryKey(): 主鍵
  id: text('id')
    .primaryKey(),
  // timestamp(): 定義時間欄位
  // notNull(): 不得為空
  // createdAt是程式內屬性名稱寫法，created_at是資料庫欄位名稱寫法
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
  // 在資料庫數字最好還是以數字類型來儲存
  // 例如使用integer，在前端通過乘除將小數位進位到整數，儲存到資料庫
  // 比字串類型更節省空間、可運算、查詢效率高、正負數等
})

export const likedSongs = pgTable('liked_songs', {
  id: text('id')
    .primaryKey(),
  userId: text('user_id')
    .notNull(),
  songId: text('song_id')
    // 當此song被刪除時，將會連同有關的likedSong一併刪除
    .references(() => songs.id, {
      onDelete: 'cascade',
    })
    .notNull(),
})

// 解構出many函數，定義一對多關係
export const songsRelations = relations(songs, ({ many }) => ({
  // 表示一個song可以對應到多個likedSongs
  likedSongs: many(likedSongs),
}))

// 解構出one函數，定義多對一關係
export const likedSongsRelations = relations(likedSongs, ({ one }) => ({
  // 表示一個likedSong可以對應到一個song
  songs: one(songs, {
    // 本地欄位
    fields: [likedSongs.songId],
    // 參考欄位
    references: [songs.id],
  }),
}))

// 建立zod驗證規範: 當要新增資料時，zod會確保資料符合欄位類型和限制
// createInsertSchema: 可提供後端API驗證與前端表單驗證
// 在後端與前端都可以使用pick來挑選要驗證的欄位，或是omit來選擇除此欄位之外都要驗證
export const insertSongSchema = createInsertSchema(songs, {
  createdAt: z.coerce.date(),
})
  .extend({
    id: z.string()
      .optional(),
    userId: z.string()
      .optional(),
    title: z.string()
      .min(1, 'Title is required'),
    album: z.string()
      .min(1, 'Album is required'),
    songUrl: z.string()
      .url('Song need uploaded'),
    imageUrl: z.string()
      .url('Image need uploaded'),
  })
export const insertLikedSongSchema = createInsertSchema(likedSongs)

// 導出資料表欄位型別
export type SongType = typeof songs.$inferInsert
export type LikedSongType = typeof likedSongs.$inferInsert