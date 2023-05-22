import { z } from 'zod'

export const DAILY_LIMIT = 3000
export const WEEKLY_LIMIT = DAILY_LIMIT * 7 - 1000
export const MONTHLY_LIMIT = WEEKLY_LIMIT * 4 - 5000

export const userMetadataSchema = z
  .object({
    role: z.enum(['Regular', 'Premium'], {
      errorMap: () => ({ message: 'User can be either regular or premium.' }),
    }),
    quota: z.number().int().min(0).max(DAILY_LIMIT),
    dailyQuotaLimit: z.number().int().min(0).max(DAILY_LIMIT),
    weeklyQuotaLimit: z.number().int().min(0).max(WEEKLY_LIMIT),
    monthlyQuotaLimit: z.number().int().min(0).max(MONTHLY_LIMIT),
  })
  .refine((schema) => schema.dailyQuotaLimit >= schema.quota, {
    message:
      'The daily quota limit must be greater than the currently used quota.',
    path: ['dailyQuotaLimit'],
  })
  .refine((schema) => schema.weeklyQuotaLimit >= schema.quota, {
    message:
      'The weekly quota limit must be greater than the currently used quota.',
    path: ['weeklyQuotaLimit'],
  })
  .refine((schema) => schema.monthlyQuotaLimit >= schema.quota, {
    message:
      'The monthly quota limit must be greater than the currently used quota.',
    path: ['monthlyQuotaLimit'],
  })

export type UserMetadata = z.infer<typeof userMetadataSchema>
