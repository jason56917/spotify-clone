import { Hono } from 'hono'
import { handle } from 'hono/vercel'
// 引進分支路由模組
import songs from './songs'
import likeSongs from './likedSongs'

// 設定這個API在Vercel Edge運行時執行
export const runtime = 'edge'

// 建立一個新的hono實例，並設定基礎路徑為/api
const app = new Hono()
  .basePath('/api')

// 掛載分支路由模組到分支路徑
const routes = app
  .route('/songs', songs)
  .route('/liked-songs', likeSongs)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

// 導出routes的型別
export type AppType = typeof routes