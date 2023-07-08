import { createRouter } from './trpc'
import { userRouter } from './routers/user'
import { chatRouter } from './routers/chat'
import { channelRouter } from './routers/channel'

export const appRouter = createRouter({
  user: userRouter,
  chat: chatRouter,
  channel: channelRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
