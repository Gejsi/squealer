import { clerkClient } from '@clerk/nextjs/server'
import type { User } from '@prisma/client'

export type ClerkUser = Awaited<
  ReturnType<typeof clerkClient.users.getUserList>
>[0]

/** Contains both database and clerk informations about the user. */
export type FullUser = ClerkUser & User
