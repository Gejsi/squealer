import Link from 'next/link'
import Image from 'next/image'
import { api } from '../utils/api'
import type { Page } from './_app'
import Spinner from '../components/Spinner'
import ErrorTemplate from '../components/ErrorTemplate'
import { MdGroup } from 'react-icons/md'

const GroupsPage: Page = () => {
  const { data, isLoading, isError, error } = api.channel.getAll.useQuery()

  if (isError)
    return (
      <ErrorTemplate
        message={error.message}
        statusCode={error.data?.httpStatus}
      />
    )

  return (
    <>
      <div className='mb-10 mt-8 flex items-center gap-4'>
        <MdGroup className='h-8 w-8 flex-shrink-0' />
        <span>All the private channels you can subscribed to.</span>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <ul className='menu rounded-box bg-base-200'>
          {data.map((channel) => (
            <li key={channel.id}>
              <Link href={'/channels/' + channel.id}>
                <div className='avatar-group -space-x-6'>
                  {channel.members.slice(0, 4).map((member) => (
                    <div className='avatar' key={member.id}>
                      <div className='w-12'>
                        <Image
                          src={member.profileImageUrl}
                          alt='User profile picture'
                          fill
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className='flex-1'>
                  <p>{channel.name}</p>
                  <div className='flex flex-col justify-between gap-2 md:flex-row'>
                    <p className='text-xs italic'>
                      Owner: {channel.owner.username}
                    </p>
                    <p className='text-xs'>
                      Squeals: {channel._count.squeals} • Members{' '}
                      {channel._count.members}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

GroupsPage.title = 'All channels'

export default GroupsPage
