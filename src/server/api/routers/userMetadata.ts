import { createRouter, authedProcedure } from '../trpc'
import { clerkClient } from '@clerk/nextjs/server'
import { userMetadataSchema } from '../../../schemas/user-metadata'

export const userMetadataRouter = createRouter({
  updateUserMetadata: authedProcedure
    .input(userMetadataSchema)
    .mutation(({ ctx, input }) => {
      clerkClient.users.updateUserMetadata(ctx.auth.userId, {
        publicMetadata: { ...input },
      })

      return input
    }),
})
