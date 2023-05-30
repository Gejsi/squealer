import { createRouter } from './trpc'
import { userRouter } from './routers/user'

export const appRouter = createRouter({
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
