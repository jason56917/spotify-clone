import { z } from 'zod'
import { db } from '@/db/drizzle'
import { insertSongSchema, songs } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { createId } from '@paralleldrive/cuid2'

const app = new Hono()
  // /: 取得全部的音樂
  .get(
    '/',
    async (c) => {
      const data = await db
        .select({
          id: songs.id,
          createdAt: songs.createdAt,
          userId: songs.userId,
          title: songs.title,
          album: songs.album,
          songUrl: songs.songUrl,
          imageUrl: songs.imageUrl,
        })
        .from(songs)
        .orderBy(
          desc(songs.createdAt)
        )
      // 根據取得的資料是單獨或者陣列來回傳null或[]
      if (!data) {
        return c.json({ data: [] })
      }

      return c.json({ data })
    }
  )
  // /upload 根據userId抓取音樂
  .get(
    '/upload',
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c)
      // 根據實際需求回傳
      // c.json({ error: 'Unauthorized' }, 401)
      if (!auth?.userId) {
        return c.json({ data: [] })
      }

      const data = await db
        .select({
          id: songs.id,
          createdAt: songs.createdAt,
          userId: songs.userId,
          title: songs.title,
          album: songs.album,
          songUrl: songs.songUrl,
          imageUrl: songs.imageUrl,
        })
        .from(songs)
        .where(
          eq(songs.userId, auth.userId)
        )
      if (!data) {
        return c.json({ data: [] })
      }

      return c.json({ data })
    }
  )
  // /:id 根據id抓取音樂
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string()
          .optional(),
      })
    ),
    // clerkMiddleware(),
    async (c) => {
      // const auth = getAuth(c)
      // if (!auth?.userId) {
      //   return c.json({ error: 'Unauthorized' }, 401)
      // }

      const { id } = c.req.valid('param')
      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [data] = await db
        .select({
          id: songs.id,
          createdAt: songs.createdAt,
          userId: songs.userId,
          title: songs.title,
          album: songs.album,
          songUrl: songs.songUrl,
          imageUrl: songs.imageUrl,
        })
        .from(songs)
        .where(
          eq(songs.id, id)
        )

      if (!data) {
        return c.json({ data: null })
      }

      return c.json({ data })
    }
  )

  // /: 上傳音樂
  .post(
    '/',
    clerkMiddleware(),
    zValidator(
      'json',
      insertSongSchema
        .pick({
          title: true,
          album: true,
          songUrl: true,
          imageUrl: true,
        })
    ),
    async (c) => {
      const auth = getAuth(c)
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const values = c.req.valid('json')
      if (!values) {
        return c.json({ error: 'Invalid data' }, 400)
      }

      const [data] = await db.insert(songs)
        .values({
          id: createId(),
          createdAt: new Date(),
          userId: auth.userId,
          ...values,
        })
        .returning()

      return c.json({ data })
    }
  )

export default app