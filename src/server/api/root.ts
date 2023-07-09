import { createRouter } from './trpc'
import { userRouter } from './routers/user'
import { chatRouter } from './routers/chat'
import { channelRouter } from './routers/channel'
import { squealRouter } from './routers/squeal'

export const appRouter = createRouter({
  user: userRouter,
  chat: chatRouter,
  channel: channelRouter,
  squeal: squealRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
