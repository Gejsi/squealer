import { createRouter } from './trpc'
import { userRouter } from './routers/user'
import { chatRouter } from './routers/chat'

export const appRouter = createRouter({
  user: userRouter,
  chat: chatRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
