import { z } from 'zod'
import { createRouter, publicProcedure, authedProcedure } from '../trpc'
import { clerkClient } from '@clerk/nextjs/server'

export const userMetadataRouter = createRouter({
  hello: authedProcedure.mutation(() => {
    return
  }),
})
