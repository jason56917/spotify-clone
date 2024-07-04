import { db } from '@/db/drizzle'
import { likedSongs, songs } from '@/db/schema'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'

const app = new Hono()
  // /:songId 根據songId抓取喜歡的音樂
  .get(
    '/:songId',
    zValidator(
      'param',
      z.object({
        songId: z.string()
          .optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c)
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { songId } = c.req.valid('param')
      if (!songId) {
        return c.json({ error: 'Missing songId' }, 400)
      }

      const [data] = await db
        .select({
          id: likedSongs.id,
          userId: likedSongs.userId,
          songId: likedSongs.songId,
        })
        .from(likedSongs)
        .where(
          and(
            eq(likedSongs.userId, auth.userId),
            eq(likedSongs.songId, songId)
          )
        )
      if (!data) {
        return c.json({ data: null })
      }

      return c.json({ data })
    }
  )
  // /:songId 根據songId加入喜歡的音樂
  .post(
    '/:songId',
    zValidator(
      'param',
      z.object({
        songId: z.string()
          .optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c)
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { songId } = c.req.valid('param')
      if (!songId) {
        return c.json({ error: 'Missing songId' }, 400)
      }

      const [data] = await db.insert(likedSongs)
        .values({
          id: createId(),
          userId: auth.userId,
          songId: songId,
        })
        .returning()

      return c.json({ data })
    }
  )
  // /:songId 根據songId刪除喜歡的音樂
  .delete(
    '/:songId',
    zValidator(
      'param',
      z.object({
        songId: z.string()
          .optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c)
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { songId } = c.req.valid('param')
      if (!songId) {
        return c.json({ error: 'Missing songId' }, 401)
      }

      const [data] = await db
        .delete(likedSongs)
        .where(
          and(
            eq(likedSongs.userId, auth.userId),
            eq(likedSongs.songId, songId)
          )
        )
        .returning({
          id: likedSongs.id,
        })
      if (!data) {
        return c.json({ error: 'Song not found' }, 404)
      }

      return c.json({ data })
    }
  )
  // / 根據userId抓取喜歡的音樂
  // 直接通過clerk的userId抓取音樂
  .get(
    '/',
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c)
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const data = await db
        .select({
          id: likedSongs.id,
          userId: likedSongs.userId,
          songId: likedSongs.songId,
          song: {
            id: songs.id,
            createdAt: songs.createdAt,
            userId: songs.userId,
            title: songs.title,
            album: songs.album,
            songUrl: songs.songUrl,
            imageUrl: songs.imageUrl,
          },
        })
        .from(likedSongs)
        .innerJoin(
          songs,
          eq(likedSongs.songId, songs.id)
        )
        .where(
          and(
            eq(likedSongs.userId, auth.userId)
          )
        )
      if (!data) {
        return c.json({ data: [] })
      }

      return c.json({ data })
    }
  )

export default app