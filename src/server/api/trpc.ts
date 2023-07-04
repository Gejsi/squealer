import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/api'
import { getAuth } from '@clerk/nextjs/server'
import { initTRPC, TRPCError } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError, z } from 'zod'
import { prisma } from '../db'

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
  return createInnerTRPCContext({ auth: getAuth(opts.req) })
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

const isProtected = isAuthed.unstable_pipe(async ({ next, ctx, rawInput }) => {
  const parsedChannelId = z
    .object({ channelId: z.string().cuid() })
    .safeParse(rawInput)

  if (!parsedChannelId.success)
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Provide a valid channel ID.',
    })

  const isMember =
    (await ctx.prisma.channel.findFirst({
      where: {
        id: parsedChannelId.data.channelId,
        members: {
          some: {
            id: ctx.auth.userId,
          },
        },
      },
    })) != null

  if (!isMember)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not a member of the specified channel',
    })

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  })
})

const isPremium = isAuthed.unstable_pipe(({ next, ctx }) => {
  if (!ctx.auth.user || ctx.auth.user.privateMetadata.role !== 'Premium')
    throw new TRPCError({
      code: 'UNAUTHORIZED',
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
export const protectedProcedure = publicProcedure.use(isProtected)
export const premiumProcedure = publicProcedure.use(isPremium)
