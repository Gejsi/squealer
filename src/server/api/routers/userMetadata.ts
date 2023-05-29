import { createRouter, authedProcedure } from '../trpc'
import {
  type UserMetadata,
  userMetadataSchema,
} from '../../../schemas/user-metadata'
import { Prisma } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'

const commonSelector = Prisma.validator<Prisma.UserSelect>()({
  role: true,
  quota: true,
  dailyQuotaLimit: true,
  weeklyQuotaLimit: true,
  monthlyQuotaLimit: true,
})

export const userMetadataRouter = createRouter({
  get: authedProcedure.query(async ({ ctx }) => {
    let userMetadata
    userMetadata = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId },
      select: commonSelector,
    })

    if (!userMetadata) {
      userMetadata = await ctx.prisma.user.create({
        data: { id: ctx.auth.userId },
      })
    }

    // makes the premium middleware work without re-fetching the current user
    await clerkClient.users.updateUserMetadata(ctx.auth.userId, {
      privateMetadata: { role: userMetadata.role },
    })

    return userMetadata as UserMetadata
  }),
  update: authedProcedure
    .input(userMetadataSchema)
    .mutation(async ({ ctx, input }) => {
      const userMetadata = await ctx.prisma.user.update({
        where: { id: ctx.auth.userId },
        data: {
          role: input.role,
          quota: input.quota,
          dailyQuotaLimit: input.dailyQuotaLimit,
          weeklyQuotaLimit: input.weeklyQuotaLimit,
          monthlyQuotaLimit: input.monthlyQuotaLimit,
        },
        select: commonSelector,
      })

      return userMetadata
    }),
})
