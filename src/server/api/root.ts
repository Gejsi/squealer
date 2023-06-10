import { createRouter } from './trpc'
import { userRouter } from './routers/user'
import { squealRouter } from './routers/squeal'

export const appRouter = createRouter({
  user: userRouter,
  squeal: squealRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
