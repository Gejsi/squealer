import { MdInfoOutline, MdSave } from 'react-icons/md'
import type { Page } from './_app'
import { useUser } from '@clerk/nextjs'
import { useAtom } from 'jotai'
import { publicMetadataAtom } from '../components/Layout'

const Settings: Page = () => {
  const { user } = useUser()
  const [publicMetadata] = useAtom(publicMetadataAtom)

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

      <div className='my-4 flex flex-col items-center gap-4'>
        <div className='avatar'>
          <div className='w-28 rounded-full'>
            <img src={user?.profileImageUrl} alt='User profile picture' />
          </div>
        </div>
        <p className='text-lg font-medium'>
          {user?.username ?? user?.primaryEmailAddress?.emailAddress}
        </p>
      </div>

      <div className='rounded-box flex flex-col gap-4 border-2 border-solid border-base-content/30 p-8'>
        <div className='flex items-center'>
          <label className='flex-1' htmlFor='role'>
            Change user role
          </label>

          <select
            className='select-bordered select capitalize'
            id='role'
            defaultValue={publicMetadata.role}
          >
            <option>regular</option>
            <option>premium</option>
          </select>
        </div>

        <div className='flex items-center'>
          <label className='flex-1' htmlFor='quota'>
            Change currently used quota
          </label>

          <input
            className='input-bordered input'
            id='quota'
            type='number'
            min='0'
            max='1000'
            size={7}
            defaultValue={publicMetadata.quota}
          />
        </div>

        <div className='flex items-center'>
          <label className='flex-1' htmlFor='quotaLimit'>
            Change quota limit
          </label>

          <input
            className='input-bordered input'
            id='quotaLimit'
            type='number'
            min='0'
            max='1000'
            size={7}
            defaultValue={publicMetadata.quotaLimit}
          />
        </div>

        <div className='flex justify-center'>
          <button className='btn gap-2'>
            <MdSave className='h-6 w-6' />
            Save
          </button>
        </div>
      </div>
    </>
  )
}

Settings.title = 'My profile'

export default Settings
