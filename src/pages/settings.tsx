import { MdInfoOutline, MdSave } from 'react-icons/md'
import Image from 'next/image'
import type { Page } from './_app'
import { useUser } from '@clerk/nextjs'
import { useAtom } from 'jotai'
import { publicMetadataAtom } from '../components/Layout'
import { api } from '../utils/api'
import { toast } from 'react-hot-toast'
import useZodForm from '../hooks/use-zod-form'
import { userMetadataSchema } from '../schemas/user-metadata'
import { cn } from '../utils/misc'

const Settings: Page = () => {
  const { user } = useUser()
  const [publicMetadata, setPublicMetadata] = useAtom(publicMetadataAtom)
  const utils = api.useContext()
  const metadataMutation = api.userMetadata.updateUserMetadata.useMutation({
    onError() {
      toast.error('Unable to save settings.')
    },
    onSuccess(data) {
      toast.success('Settings saved.')
      setPublicMetadata(data)
    },
    onSettled() {
      utils.userMetadata.invalidate()
    },
  })

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useZodForm({
    schema: userMetadataSchema,
    defaultValues: { ...publicMetadata },
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
          {user?.username ?? user?.primaryEmailAddress?.emailAddress}
        </p>
      </div>

      <form
        className='rounded-box flex flex-col gap-2 border-2 border-solid border-base-content/30 p-4 md:p-8'
        onSubmit={submitForm((data) => metadataMutation.mutate(data))}
      >
        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <div className='flex flex-1 flex-col'>
            <label htmlFor='role'>Change user role</label>
            <span className='text-sm text-error'>
              {errors.role && errors.role.message}
            </span>
          </div>

          <select
            className='select-bordered select capitalize'
            id='role'
            {...register('role')}
          >
            <option>regular</option>
            <option>premium</option>
          </select>
        </div>

        <div className='divider' />

        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <div className='flex flex-1 flex-col'>
            <label htmlFor='quota'>Change currently used quota</label>
            <span className='text-sm text-error'>
              {errors.quota && errors.quota.message}
            </span>
          </div>

          <input
            className='input-bordered input'
            id='quota'
            type='number'
            min='-1'
            max='1000'
            size={7}
            {...register('quota', { valueAsNumber: true })}
          />
        </div>

        <div className='divider' />

        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <div className='flex flex-1 flex-col'>
            <label htmlFor='quotaLimit'>Change quota limit</label>
            <span className='text-sm text-error'>
              {errors.quotaLimit && errors.quotaLimit.message}
            </span>
          </div>

          <input
            className='input-bordered input'
            id='quotaLimit'
            type='number'
            min='0'
            max='1000'
            size={7}
            {...register('quotaLimit', { valueAsNumber: true })}
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
