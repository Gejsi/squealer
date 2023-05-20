import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/api'
import { clerkClient, getAuth } from '@clerk/nextjs/server'
import { initTRPC, TRPCError } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { prisma } from '../db'
import {
  DAILY_LIMIT,
  MONTHLY_LIMIT,
  WEEKLY_LIMIT,
} from '../../schemas/user-metadata'

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject
}

/**
 * This helper generates the "internals" for a tRPC context.
 */
const createInnerTRPCContext = ({ auth }: AuthContext) => {
  return {
    auth,
    prisma,
  }
}

/**
 * This is the actual context used in the router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const auth = getAuth(opts.req)

  const publicMetadata: UserPublicMetadata = (auth.sessionClaims as any)
    .public_metadata

  if (
    auth.userId &&
    publicMetadata &&
    (!('role' in publicMetadata) ||
      !('quota' in publicMetadata) ||
      !('dailyQuotaLimit' in publicMetadata) ||
      !('weeklyQuotaLimit' in publicMetadata) ||
      !('monthlyQuotaLimit' in publicMetadata))
  ) {
    // add 'regular' role and some quota of characters by default for all users
    await clerkClient.users.updateUserMetadata(auth.userId, {
      publicMetadata: {
        role: 'regular',
        quota: 500,
        dailyQuotaLimit: DAILY_LIMIT,
        weeklyQuotaLimit: WEEKLY_LIMIT,
        monthlyQuotaLimit: MONTHLY_LIMIT,
      },
    })
  }

  return createInnerTRPCContext({ auth })
}

/**
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only authenticated users can access this feature.',
    })

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  })
})

const isPremium = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only authenticated users can access this feature.',
    })

  if (ctx.auth.user && ctx.auth.user.publicMetadata.role !== 'premium')
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only premium users can access this feature.',
    })

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  })
})

export const createRouter = t.router
export const publicProcedure = t.procedure
export const authedProcedure = publicProcedure.use(isAuthed)
export const premiumProcedure = authedProcedure.use(isPremium)
