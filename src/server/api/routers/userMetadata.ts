import { createRouter, authedProcedure } from '../trpc'
import { clerkClient } from '@clerk/nextjs/server'
import { userMetadataSchema } from '../../../schemas/user-metadata'

export const userMetadataRouter = createRouter({
  updateUserMetadata: authedProcedure
    .input(userMetadataSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await clerkClient.users.updateUserMetadata(ctx.auth.userId, {
        publicMetadata: { ...input },
      })

      return user.publicMetadata
    }),
})
