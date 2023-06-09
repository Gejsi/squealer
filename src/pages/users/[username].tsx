import Image from 'next/image'
import { useRouter } from 'next/router'
import type { Page } from '../_app'
import { api } from '../../utils/api'
import ErrorTemplate from '../../components/ErrorTemplate'
import Spinner from '../../components/Spinner'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Bubble from '../../components/Bubble'

const UserPage: Page = () => {
  const username = useRouter().query.username as string
  const [autoAnimate] = useAutoAnimate()

  const {
    data: user,
    isLoading,
    error,
    isError,
  } = api.user.get.useQuery(
    { username },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  if (isError)
    return (
      <ErrorTemplate
        message={error.message}
        statusCode={error.data?.httpStatus}
      />
    )

  if (isLoading) return <Spinner />

  return (
    <div className='flex flex-col gap-4'>
      <div className='my-4 flex flex-col items-center justify-evenly gap-4 md:flex-row'>
        <div className='flex flex-col items-center gap-2'>
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
          <p className='text-xl font-medium'>@{user.username}</p>
        </div>

        <div className='flex max-w-full flex-col gap-4'>
          <div className='stats bg-base-200 shadow'>
            <div className='stat'>
              <div className='stat-title'>Role</div>
              <div className='stat-value text-lg'>{user.role}</div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Quota used</div>
              <div className='stat-value text-lg'>{user.quota}</div>
            </div>
          </div>

          <div className='stats bg-base-200 shadow'>
            <div className='stat'>
              <div className='stat-title'>Owned channels</div>
              <div className='stat-value text-lg'>
                {user._count?.ownedChannels}
              </div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Reactions</div>
              <div className='stat-value text-lg'>{user._count?.reactions}</div>
            </div>
          </div>
        </div>
      </div>

      <div className='divider' />

      <div className='flex flex-col gap-4' ref={autoAnimate}>
        {user.squeals?.map((squeal) => (
          <Bubble
            key={squeal.id}
            squeal={squeal as any}
            origin={squeal.channel.name}
          />
        ))}
      </div>
    </div>
  )
}

UserPage.title = 'User details'

export default UserPage
