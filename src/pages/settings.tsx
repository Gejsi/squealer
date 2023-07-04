import { useUser } from '@clerk/nextjs'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { MdInfoOutline, MdSave } from 'react-icons/md'
import { userMetadataAtom } from '../components/Layout'
import useZodForm from '../hooks/use-zod-form'
import {
  DAILY_LIMIT,
  MONTHLY_LIMIT,
  WEEKLY_LIMIT,
  userMetadataSchema,
} from '../schemas/user-metadata'
import { api } from '../utils/api'
import { cn } from '../utils/misc'
import type { Page } from './_app'

const Settings: Page = () => {
  const { user } = useUser()
  const [userMetadata, setUserMetadata] = useAtom(userMetadataAtom)
  const context = api.useContext()
  const metadataMutation = api.user.updateMetadata.useMutation({
    onError() {
      toast.error('Unable to save settings.')
    },
    onSuccess(data) {
      toast.success('Settings saved.')
      setUserMetadata(data)
    },
    onSettled() {
      context.user.getMetadata.invalidate()
    },
  })

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useZodForm({
    schema: userMetadataSchema,
    defaultValues: { ...userMetadata },
  })

  return (
    <>
      <div className='alert alert-info mb-4 shadow-lg'>
        <div>
          <MdInfoOutline className='h-6 w-6 flex-shrink-0' />
          <span>
            This page has artificial features implemented because payments
            aren't supported.
          </span>
        </div>
      </div>

      <div className='my-4 flex flex-col items-center gap-2'>
        <div className='avatar'>
          <div className='relative w-28'>
            {user?.profileImageUrl && (
              <Image
                src={user?.profileImageUrl}
                alt='User profile picture'
                fill
                className='rounded-full'
              />
            )}
          </div>
        </div>
        <p className='text-lg font-medium'>
          {user?.username
            ? '@' + user.username
            : user?.primaryEmailAddress?.emailAddress}
        </p>
      </div>

      <form
        className='rounded-box flex flex-col gap-2 border-2 border-solid border-base-content/30 p-4 md:p-8'
        onSubmit={submitForm((data) => metadataMutation.mutate(data))}
      >
        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <div className='flex flex-1 flex-col'>
            <label htmlFor='role'>User role</label>
            <span className='text-sm text-error'>
              {errors.role && errors.role.message}
            </span>
          </div>

          <select
            className='select-bordered select'
            id='role'
            {...register('role')}
          >
            <option>Regular</option>
            <option>Premium</option>
          </select>
        </div>

        <div className='divider' />

        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <div className='flex flex-1 flex-col'>
            <label htmlFor='quota'>Currently used quota</label>
            <span className='text-sm text-error'>
              {errors.quota && errors.quota.message}
            </span>
          </div>

          <input
            className='input-bordered input'
            id='quota'
            type='number'
            min='0'
            max={DAILY_LIMIT}
            size={7}
            {...register('quota', { valueAsNumber: true })}
          />
        </div>

        <div className='divider' />

        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <div className='flex flex-1 flex-col'>
            <label htmlFor='dailyQuotaLimit'>Daily quota limit</label>
            <span className='text-sm text-error'>
              {errors.dailyQuotaLimit && errors.dailyQuotaLimit.message}
            </span>
          </div>

          <input
            className='input-bordered input'
            id='dailyQuotaLimit'
            type='number'
            min='0'
            max={DAILY_LIMIT}
            size={7}
            {...register('dailyQuotaLimit', { valueAsNumber: true })}
          />
        </div>

        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <div className='flex flex-1 flex-col'>
            <label htmlFor='weeklyQuotaLimit'>Weekly quota limit</label>
            <span className='text-sm text-error'>
              {errors.weeklyQuotaLimit && errors.weeklyQuotaLimit.message}
            </span>
          </div>

          <input
            className='input-bordered input'
            id='weeklyQuotaLimit'
            type='number'
            min='0'
            max={WEEKLY_LIMIT}
            size={7}
            {...register('weeklyQuotaLimit', { valueAsNumber: true })}
          />
        </div>

        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <div className='flex flex-1 flex-col'>
            <label htmlFor='monthlyQuotaLimit'>Monthly quota limit</label>
            <span className='text-sm text-error'>
              {errors.monthlyQuotaLimit && errors.monthlyQuotaLimit.message}
            </span>
          </div>

          <input
            className='input-bordered input'
            id='monthlyQuotaLimit'
            type='number'
            min='0'
            max={MONTHLY_LIMIT}
            size={7}
            {...register('monthlyQuotaLimit', { valueAsNumber: true })}
          />
        </div>

        <div className='divider' />

        <div className='flex justify-center'>
          <button
            className={cn('btn gap-2', { loading: metadataMutation.isLoading })}
          >
            {!metadataMutation.isLoading && <MdSave className='h-6 w-6' />}
            Save
          </button>
        </div>
      </form>
    </>
  )
}

Settings.title = 'Settings'

export default Settings
