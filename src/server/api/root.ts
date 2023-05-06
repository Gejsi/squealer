import { createRouter } from './trpc'
import { userMetadataRouter } from './routers/userMetadata'

export const appRouter = createRouter({
  userMetadata: userMetadataRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
